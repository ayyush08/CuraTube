import ImageKit from "imagekit";
import fs from "fs";
const IMAGEKIT_URL_ENDPOINT = process.env.IMAGEKIT_URL_ENDPOINT;
const IMAGEKIT_PUBLIC_KEY = process.env.IMAGEKIT_PUBLIC_KEY;
const IMAGEKIT_PRIVATE_KEY = process.env.IMAGEKIT_PRIVATE_KEY;

if(!IMAGEKIT_URL_ENDPOINT || !IMAGEKIT_PUBLIC_KEY || !IMAGEKIT_PRIVATE_KEY) {
    throw new Error("Missing ImageKit configuration in environment variables.");
}

const imagekit = new ImageKit({
    publicKey: IMAGEKIT_PUBLIC_KEY,
    privateKey: IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: IMAGEKIT_URL_ENDPOINT,
});


export const uploadOnImageKit = async (localFilePath,folder) => {
    try {
            if(!localFilePath) return null
            const file = fs.readFileSync(localFilePath)
            const response = await imagekit.upload({
                file: file, // required
                fileName: localFilePath.split('/').pop(), // required, use the file name from the local path
                folder: folder, // optional, specify the folder name if needed
                useUniqueFileName: true, // optional, if you want to use a unique file name
            }) 
            //file has been uploaded successfully
            console.log('File Upload Successfully on Imagekit',response);
            fs.unlinkSync(localFilePath)
            return response
        } catch (error) {
            fs.unlinkSync(localFilePath) //remove the locally saved temporary files as upload got failed
            return null;
        }
}