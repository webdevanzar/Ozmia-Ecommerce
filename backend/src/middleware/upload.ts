import multer from "multer";

const MAX_SIZE = 5 * 1024 * 1024;

const fileFilter = (
  _req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/svg+xml",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed(jpeg, jpg, svg, png)"));
  }
};

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fieldSize: MAX_SIZE },
  fileFilter,
});

export default upload;
