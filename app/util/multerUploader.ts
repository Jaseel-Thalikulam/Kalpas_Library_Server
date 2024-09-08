import multer from "multer";

export const ImageUploader = multer({
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      return cb(null, true);
    }
    return cb(null, false);
  },
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
  storage: multer.diskStorage({
    destination: "./tmp/uploads",
    filename: (req, file, cb) => {
      const suffix = Date.now() + "-" + `${Math.random()}`.substring(2);
      console.log(suffix, "suffix");
      return cb(null, suffix + "-" + file.originalname);
    },
  }),
});
