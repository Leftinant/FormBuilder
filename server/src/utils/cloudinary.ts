import cloudinary from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME!,
  api_key: process.env.CLOUD_KEY!,
  api_secret: process.env.CLOUD_SECRET!,
});

export const uploadImage = async (base64: string) => {
  const res = await cloudinary.v2.uploader.upload(base64, {
    folder: "form-builder",
  });
  return res.secure_url;
};
