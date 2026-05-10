const fs = require('fs');
const path = require('path');
const multer = require('multer');
const crypto = require('crypto');

const uploadRoot = path.resolve(__dirname, '..', process.env.UPLOAD_DIR || 'uploads');

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

const makeStorage = (folder) => {
  const destination = path.join(uploadRoot, folder);
  ensureDir(destination);

  return multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, destination),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, `${crypto.randomUUID()}${ext}`);
    }
  });
};

const imageFilter = (_req, file, cb) => {
  if (['image/jpeg', 'image/png'].includes(file.mimetype)) {
    cb(null, true);
    return;
  }
  cb(new Error('Only JPG and PNG image uploads are allowed.'));
};

const limits = { fileSize: Number(process.env.MAX_FILE_SIZE || 2097152) };

exports.avatarUpload = multer({ storage: makeStorage('avatars'), fileFilter: imageFilter, limits });
exports.coverUpload = multer({ storage: makeStorage('covers'), fileFilter: imageFilter, limits });
