const AWS = require("aws-sdk");

const { CONFIG } = require("../config/constants");

// AWS
const s3 = new AWS.S3({
  accessKeyId: CONFIG.AWS_ACCESS_KEY_ID, // your AWS access id
  secretAccessKey: CONFIG.AWS_SECRET_ACCESS_KEY, // your AWS access key
  region: CONFIG.AWS_S3_BUCKET_REGION,
});

module.exports = {
  getWebAsset: async (req, res, next) => {
    try {
      const {
        params: { key_name },
      } = req;

      const objectData = await s3
        .getObject({
          Bucket: CONFIG.AWS_S3_BUCKET_NAME,
          Key: key_name,
        })
        .promise();

      // Upload to AWS
      const response = s3
        .getObject({
          Bucket: CONFIG.AWS_S3_BUCKET_NAME,
          Key: key_name,
        })
        .createReadStream();

      res.setHeader("Content-Type", objectData.ContentType);
      res.setHeader("ContentLength", objectData.ContentLength);

      response.pipe(res);
    } catch (error) {
      return next(error);
    }
  },
};
