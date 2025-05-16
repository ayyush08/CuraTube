import ImageKit from "imagekit";
import fs from "fs";
const IMAGEKIT_URL_ENDPOINT = process.env.IMAGEKIT_URL_ENDPOINT;
const IMAGEKIT_PUBLIC_KEY = process.env.IMAGEKIT_PUBLIC_KEY;
const IMAGEKIT_PRIVATE_KEY = process.env.IMAGEKIT_PRIVATE_KEY;

if (!IMAGEKIT_URL_ENDPOINT || !IMAGEKIT_PUBLIC_KEY || !IMAGEKIT_PRIVATE_KEY) {
    throw new Error("Missing ImageKit configuration in environment variables.");
}

const imagekit = new ImageKit({
    publicKey: IMAGEKIT_PUBLIC_KEY,
    privateKey: IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: IMAGEKIT_URL_ENDPOINT,
});


export const uploadOnImageKit = async (localFilePath, folder) => {
    try {
        if (!localFilePath) return null
        const file = fs.readFileSync(localFilePath)
        const response = await imagekit.upload({
            file: file, 
            fileName: localFilePath.split('/').pop(), 
            folder: folder, 
            useUniqueFileName: true, 
        })
        console.log('File Upload Successfully on Imagekit');
        fs.unlinkSync(localFilePath)
        return response

    } catch (error) {
        fs.unlinkSync(localFilePath) 
        return null;
    }
}

export const deleteFileFromImageKit = async (fileUrl, folder) => {
    const filePath = fileUrl.replace(IMAGEKIT_URL_ENDPOINT, "");
    const fileName = filePath.replace(`/${folder}/`, '');

    const allFiles = await imagekit.listFiles({
        path: folder
    })


    const existingFile = allFiles.find(file => file.name === fileName);
    console.log(existingFile);

    if (existingFile) {
        await imagekit.deleteFile(existingFile.fileId, function (error, result) {
            if (error) console.log(error);
            else console.log(result)
        });
    }



}