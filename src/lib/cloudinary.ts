import { v2 as cloudinary, type UploadApiOptions, type UploadApiResponse } from "cloudinary";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  throw new Error("Cloudinary environment variables are required");
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true
});

type UploadBufferOptions = {
  folder: string;
  publicId?: string;
};

export async function deleteFromCloudinary(publicId: string) {
  return cloudinary.uploader.destroy(publicId, {
    resource_type: "image",
    invalidate: true
  });
}

export function uploadBufferToCloudinary(
  buffer: Buffer,
  options: UploadBufferOptions
): Promise<UploadApiResponse> {
  const uploadOptions: UploadApiOptions = {
    folder: options.folder,
    public_id: options.publicId,
    resource_type: "image",
    overwrite: true,
    transformation: [
      {
        quality: "auto:good",
        fetch_format: "auto"
      }
    ]
  };

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(result as UploadApiResponse);
    });

    stream.end(buffer);
  });
}
