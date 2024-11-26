import multer from "multer";
import fs from "fs";

// Create uploads directory if it doesn't exist
const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// set storage
const storage = multer.diskStorage({
  // desitnation
  destination: function (req, res, cb) {
    cb(null, uploadDir);
  },
  // filename
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + file.originalname);
  },
});

const filerFilter = (req, file, cb) => {
  cb(null, true);
};

let uploadFile = multer({
  storage: storage,
  fileFilter: filerFilter,
});

export default uploadFile.single("avatar");