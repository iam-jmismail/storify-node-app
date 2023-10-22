const mongoose = require("mongoose");
const { startSession } = require("mongoose");
const AWS = require("aws-sdk");
const path = require("path");
const fs = require("fs");

// Config
const { CONFIG } = require("../config/constants");
const {
  SUBSCRIPTIONS,
  ITEMS_SUBSCRIPTIONS,
} = require("../config/subscriptions");

// Models
const ItemModel = require("../models/item");
const UserModel = require("../models/user");

// Error Classes
const {
  ResourceConflictError,
  ValidationError,
  ForbiddenError,
  NotFoundError,
} = require("../helpers/error-handler");

// Utils
const { getPaginationMeta } = require("../helpers/utils");

// AWS
const s3 = new AWS.S3({
  accessKeyId: CONFIG.AWS_ACCESS_KEY_ID, // your AWS access id
  secretAccessKey: CONFIG.AWS_SECRET_ACCESS_KEY, // your AWS access key
  region: CONFIG.AWS_S3_BUCKET_REGION,
});

module.exports = {
  createItem: async (req, res, next) => {
    const {
      body: { title, description, price, keywords, batch },
      user: { user_id },
      files,
    } = req;

    let session;

    try {
      const user = await UserModel.findOne({
        _id: new mongoose.Types.ObjectId(user_id),
        is_deleted: false,
      });

      if (!user) throw new NotFoundError("User not found");

      // Check subscription limits
      if (user?.item_count >= ITEMS_SUBSCRIPTIONS[user.subscription]) {
        throw new ForbiddenError("Maximum item count exceeded");
      }

      if (user?.batch_count > SUBSCRIPTIONS[user.subscription])
        throw new ForbiddenError("Maximum batch count exceeded");

      // Start a Mongoose session
      session = await startSession();
      session.startTransaction();

      const _keywords = JSON.parse(keywords);
      const _price = Number(price);

      if (!_price) throw new ValidationError({ price: "Invalid Price" });

      // Upload files
      let upload_files = [];

      if (Array.isArray(files.pictures) && files.pictures.length > 0) {
        await Promise.all(
          files.pictures?.map(async (file) => {
            const file_path = path.join("./uploads", file.filename);
            const buffer = fs.readFileSync(file_path);

            return await s3
              .upload({
                Bucket: CONFIG.AWS_S3_BUCKET_NAME,
                Key: file.filename,
                Body: Buffer.from(buffer),
              })
              .promise();
          })
        ).then((responses) => {
          upload_files = responses.map((o) => o.Key);
        });
      }

      const item_data = {
        title,
        description,
        price: _price,
        keywords: _keywords,
        batch: user?.batch_count,
        user_id: new mongoose.Types.ObjectId(user_id), // Convert to ObjectId
        created_at: new Date(),
        updated_at: new Date(),
      };

      if (upload_files.length > 0) {
        item_data["images"] = upload_files;
      }

      // Create a new item using the session
      const item = new ItemModel(item_data);

      // Save the item using the session
      await item.save({ session });

      // Increment Item Count
      await UserModel.updateMany(
        {
          _id: new mongoose.Types.ObjectId(user_id),
        },
        {
          $inc: {
            item_count: 1,
          },
        }
      );

      // Commit the transaction
      await session.commitTransaction();

      // End the session
      session.endSession();

      // Send a success response
      res.sendNoContentResponse();
    } catch (error) {
      // If an error occurs, abort the transaction and handle the error
      if (session) {
        await session.abortTransaction();
        session.endSession();
      }
      return next(error);
    }
  },
  getItems: async (req, res, next) => {
    const {
      user: { user_id },
      query: { page = 1, limit = 10, meta = 0 },
    } = req;

    try {
      const matchArguments = {
        user_id: new mongoose.Types.ObjectId(user_id),
        is_deleted: false,
      };

      const items = await ItemModel.aggregate([
        {
          $match: matchArguments,
        },
        {
          $skip: (page - 1) * limit,
        },
        {
          $limit: parseInt(limit),
        },
        {
          $project: {
            title: 1,
            description: 1,
            price: 1,
            images: 1,
          },
        },
      ]);

      if (!items.length) return res.sendNoContentResponse();

      if (meta) {
        const count = await ItemModel.count(matchArguments);
        res.sendPaginationResponse(
          items,
          getPaginationMeta(+page, limit, count)
        );
      } else {
        res.sendSuccessResponse(items, "Success");
      }

      // res.
    } catch (error) {
      return next(error);
    }
  },
  getItemsByBatch: async (req, res, next) => {
    const {
      user: { user_id },
      query: { page = 1, limit = 10, meta = 0 },
      params: { batch_no },
    } = req;

    try {
      const matchArguments = {
        user_id: new mongoose.Types.ObjectId(user_id),
        is_deleted: false,
        batch: +batch_no,
      };

      const items = await ItemModel.aggregate([
        {
          $match: matchArguments,
        },
        {
          $sort: {
            created_at: -1,
          },
        },
        {
          $skip: (page - 1) * limit,
        },
        {
          $limit: parseInt(limit),
        },
        {
          $project: {
            title: 1,
            description: 1,
            price: 1,
            images: 1,
          },
        },
      ]);

      if (!items.length) return res.sendNoContentResponse();

      if (meta) {
        const count = await ItemModel.count(matchArguments);
        res.sendPaginationResponse(
          items,
          getPaginationMeta(+page, limit, count)
        );
      } else {
        res.sendSuccessResponse(items, "Success");
      }
    } catch (error) {
      return next(error);
    }
  },
};
