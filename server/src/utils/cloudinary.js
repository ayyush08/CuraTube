import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;

if (!CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET || !CLOUDINARY_CLOUD_NAME) {
    throw new Error('Cloudinary configuration is missing in .env file');
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

//Incomplete: need to fix some bugs in whole delete logic
export const deleteCloudinaryAssetByUrl = async (secureUrl) => {
    if (!secureUrl) {
        console.error('❌ No URL provided');
        return;
    }

    const publicId = getCloudinaryPublicIdFromUrl(secureUrl);
    if (!publicId) {
        console.error('❌ Could not parse public_id from URL');
        return;
    }

    console.log(`🔍 Parsed public_id: ${publicId}`);

    // Check if this is an HLS playlist (by extension in the URL)
    if (secureUrl.endsWith('.m3u8')) {
        console.log(`🎯 Detected .m3u8 video playlist. Deleting entire folder of segments.`);

        // Get the folder containing this .m3u8 file's segments
        const folderForSegments = publicId + '/';
        await deleteAllAssetsInCloudinaryFolder(folderForSegments);
    } else {
        // Otherwise, single asset
        console.log(`🎯 Deleting single asset: ${publicId}`);
        await deleteFileFromCloudinary(publicId, undefined);
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



export const deleteAllAssetsInCloudinaryFolder = async (folder) => {
    if (!folder) {
        console.error('No folder provided to deleteAllAssetsInCloudinaryFolder');
        return;
    }

    console.log(`🗑️ Deleting ALL assets in Cloudinary *prefix*: ${folder}`);

    let nextCursor = undefined;

    do {
        const result = await cloudinary.search
            .expression(`asset_folder:"${folder}"/*`)
            .max_results(100)
            .next_cursor(nextCursor)
            .execute();

        if (!result.resources || result.resources.length === 0) {
            console.log(`✅ No more files found under prefix ${folder}`);
            break;
        }

        await Promise.all(
            result.resources.map((resource) =>
                deleteFileFromCloudinary(resource.public_id, resource.resource_type)
            )
        );

        nextCursor = result.next_cursor;
    } while (nextCursor);
};


export function getCloudinaryFolderFromUrl(secureUrl) {
    if (!secureUrl) return null;
    try {
        const afterUpload = secureUrl.split('/upload/')[1];
        if (!afterUpload) return null;

        const versionAndPath = afterUpload.replace(/^v\d+\//, '');
        const dir = path.dirname(versionAndPath).replace(/\\/g, '/');
        return decodeURIComponent(dir);
    } catch {
        return null;
    }
}

export function getCloudinaryPublicIdFromUrl(secureUrl) {
    if (!secureUrl) return null;
    try {
        const afterUpload = secureUrl.split('/upload/')[1];
        if (!afterUpload) return null;

        // remove version prefix
        const noVersion = afterUpload.replace(/^v\d+\//, '');

        // decode percent encoding
        const decoded = decodeURIComponent(noVersion);

        // remove extension
        const publicId = decoded.replace(/\.[^/.]+$/, '');

        return publicId;
    } catch {
        return null;
    }
}



export const rewriteM3U8Playlist = async (playlistPath, segmentMap) => {
    let content = await fs.promises.readFile(playlistPath, 'utf-8');
    for (const [name, url] of Object.entries(segmentMap)) {
        content = content.replace(new RegExp(name, 'g'), url);
    }
    await fs.promises.writeFile(playlistPath, content, 'utf-8');
};