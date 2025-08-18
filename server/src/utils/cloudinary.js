import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { ApiError } from './ApiError.js';
import { ApiResponse } from './ApiResponse.js';

const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;

if (!CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET || !CLOUDINARY_CLOUD_NAME) {
    throw new ApiError('Cloudinary configuration is missing in .env file');
}


cloudinary.config({
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    cloud_name: CLOUDINARY_CLOUD_NAME
});


export const uploadToCloudinary = async (localFilePath, folder, fileName, resource_type) => {
    if (!localFilePath) return null;

    try {
        if (!fs.existsSync(localFilePath)) {
            console.error('File does not exist locally:', localFilePath);
            return null;
        }

        console.log(`Uploading to Cloudinary: local=${localFilePath} => folder=${folder}`);

        // Public ID = folder/filename without extension
        const ext = path.extname(fileName);
        const basename = path.basename(fileName, ext);

        const result = await cloudinary.uploader.upload(localFilePath, {
            resource_type,
            public_id: basename,
            folder: folder,
            unique_filename: true,
            overwrite: false,
        });

        console.log('✅ File uploaded successfully to Cloudinary:', result.secure_url);

        // Delete local after upload
        fs.unlinkSync(localFilePath);

        return result;

    } catch (error) {
        console.error(`❌ Cloudinary upload error for ${localFilePath}:`, error);
        try {
            if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
        } catch (unlinkErr) {
            console.error('Error deleting local file after failure:', unlinkErr);
        }
        return null;
    }
};

export const getSignedUploadUrl = async (req, res) => {
    try {
        const timestamp = Math.round(new Date().getTime() / 1000);
        const { title } = req.body;
        const now = Date.now();
        const videoFolder = `curatube-videos/${title}-${now}`;
        const thumbnailFolder = `curatube-thumbnails/${title}-${now}`;

        
        const videoParamsToSign = {
            timestamp,
            folder: videoFolder,
        };
        const videoSignature = cloudinary.utils.api_sign_request(
            videoParamsToSign,
            process.env.CLOUDINARY_API_SECRET
        );

        const thumbnailParamsToSign = {
            timestamp,
            folder: thumbnailFolder,
        };
        const thumbnailSignature = cloudinary.utils.api_sign_request(
            thumbnailParamsToSign,
            process.env.CLOUDINARY_API_SECRET
        );

        res.status(200).json(
            new ApiResponse(200, {
                video: {
                    timestamp,
                    signature: videoSignature,
                    apiKey: process.env.CLOUDINARY_API_KEY,
                    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
                    folder: videoFolder,
                },
                thumbnail: {
                    timestamp,
                    signature: thumbnailSignature,
                    apiKey: process.env.CLOUDINARY_API_KEY,
                    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
                    folder: thumbnailFolder,
                },
            }, "Signed URLs sent")
        );
    } catch (err) {
        res.status(500).json(new ApiResponse(500, { error: err.message }, "Failed to get signed URLs"));
    }
};



export const deleteFileFromCloudinary = async (publicId, resource_type) => {
    try {
        console.log(`Deleting from Cloudinary: public_id=${publicId}`);
        if (!publicId) {
            console.error('No public_id provided for deletion');
            return null;
        }

        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type
        });

        console.log('✅ Deleted from Cloudinary:', result);
        return result;
    } catch (error) {
        console.error(`❌ Cloudinary deletion error:`, error);
        return null;
    }
};






