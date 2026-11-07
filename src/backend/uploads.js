import multer from "multer";
import path from "path";
import crypto from "crypto";

import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${__dirname}/uploads/`);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${crypto.randomBytes(6).toString(`hex`)}-gambar${path.extname(file.originalname)}`,
    );
  },
});
const upload = multer({ storage: config });
export default upload;
