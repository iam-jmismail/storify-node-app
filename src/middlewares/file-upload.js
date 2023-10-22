const multer = require("multer");

// Define storage for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Destination directory for uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname.toLocaleLowerCase()); // Unique filename
  },
});

// Configure Multer
const upload = multer({ storage });

module.exports = upload;
