import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

const connectCloudinary = () => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_SECRET_KEY
    });
};

const uploadToCloudinary = (buffer, folder) => {
    return new Promise((resolve, reject) => {

        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: "image"
            },
            (error, result) => {

                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }

            }
        );

        Readable.from(buffer).pipe(uploadStream);
    });
};

export { uploadToCloudinary };

export default connectCloudinary;