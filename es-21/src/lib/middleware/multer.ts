import multer from "multer";
import { randomUUID } from "node:crypto";
import mime from "mime";

export const generatePhotoFilename = (mimeType: string) => {
  const randomFilename = `${randomUUID()}-${Date.now()}`;
  const fileExtension = mime.getExtension(mimeType);
  const filename = `${randomFilename}.${fileExtension}`;

  return filename;
};

const storage = multer.diskStorage({
  destination: "uploads/", // multer salva il file su disk e chiama la funzione generatePhotoGilename per salvare il file
  filename: (request, file, callback) => {
    return callback(null, generatePhotoFilename(file.mimetype));
  },
});
const MAX_SIZE_IN_MEGABYTES = 6 * 1024 * 1024;

const VALID_MIME_TYPES = ["image/png", "image/jpeg"];

const fileFilter: multer.Options["fileFilter"] = (request, file, callback) => {
  if (VALID_MIME_TYPES.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(
      new Error("Error: The uploaded file must be a JPG or a PNG image.")
    );
  }
};

export const multerOptions = {
  fileFilter,
  limits: {
    fileSize: MAX_SIZE_IN_MEGABYTES,
  },
};

export const initMulterMiddleware = () => {
  return multer({ storage, ...multerOptions });
};
