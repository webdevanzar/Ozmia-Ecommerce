import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const handleUpload = (
  fileBuffer: Buffer,
): Promise<any> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "ecommerce",
        public_id: String(Date.now()), 
        resource_type: "image",
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    Readable.from(fileBuffer).pipe(stream);
  });
};

export const handleDelete = async (publicId: string) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image", 
    });
    return result;
  } catch (error) {
    console.error("Cloudinary Deletion Error:", error);
    throw new Error("Cloudinary deletion failed.");
  }
};
