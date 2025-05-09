import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { deleteFileFromImageKit, uploadOnImageKit } from "../utils/imagekit.js"
import fs from 'fs';
import { Like } from "../models/like.model.js"
import { Comment } from "../models/comment.model.js"

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query = '', sortBy = 'createdAt', sortType = 'desc', userId } = req.query
    //TODO: get all videos based on query, sort, pagination



    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
    }

})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description, isPublished } = req.body
    // TODO: get video, upload to cloudinary, create video
    if (!title || !description) {
        throw new ApiError(400, "All fields are required");
    }
    let videoLocalPath;
    let thumbnailLocalPath
    if (req.files) {
        if (Array.isArray(req.files.videoFile) && req.files.videoFile.length > 0) {
            videoLocalPath = req.files.videoFile[0]?.path;
        } else {
            throw new ApiError(400, "Video is required");
        }
        if (Array.isArray(req.files.thumbnail) && req.files.thumbnail.length > 0) {
            thumbnailLocalPath = req.files.thumbnail[0]?.path;
        } else {
            fs.unlinkSync(videoLocalPath);
            throw new ApiError(400, "Thumbnail is required");
        }
    }


    const video = await uploadOnImageKit(videoLocalPath, "curatube-videos");
    const thumbnail = await uploadOnImageKit(thumbnailLocalPath, "curatube-thumbnails");

    const createdVideo = await Video.create({
        title,
        description,
        videoFile: video.url,
        thumbnail: thumbnail.url,
        duration: video.duration,
        isPublished,
        owner: req?.user._id,
    })

    if (!createdVideo) {
        throw new ApiError(400, "Failed to upload video");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, createdVideo, "Video Published Successfully"));

})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id

    const video = await Video.findById(videoId);

    if (!video) throw new ApiError(400, "Video not found");

    return res.status(200)
        .json(new ApiResponse(200, video, "Video fetched successfully"))
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { title, description } = req.body;
    //TODO: update video details like title, description, thumbnail
    const video = await Video.findById(videoId);
    if (!video) throw new ApiError(400, "Video not found");

    const thumbnailLocalPath = req.file?.path;

    if(!(title || description || thumbnailLocalPath)){
        throw new ApiError(400,"Atleast one field is required to update");
    }

    let newThumbnail;
    if(thumbnailLocalPath){
        await deleteFileFromImageKit(video.thumbnail,'curatube-thumbnails');
        newThumbnail = await uploadOnImageKit(thumbnailLocalPath,'curatube-thumbnails');
    }

    let updateOptions = {
        title,
        description,
    }

    if(thumbnailLocalPath) updateOptions.thumbnail = newThumbnail.url;

    const updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: updateOptions
        },
        {
            new:true
        }
    )

    if(!updatedVideo){
        throw new Error(400,"Failed to update video details");
    }

    return res
    .status(200)
    .json(new ApiResponse(200,updatedVideo,"Video Details Updated Successfully"));



})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
    const video = await Video.findById(videoId);

    if (!video) throw new ApiError(400, "Video not found");

    const videoUrl = video.videoFile;
    const thumbnail = video.thumbnail;
    //cleanup 
    await Promise.all([
        Like.deleteMany({ video: videoId }),
        Comment.deleteMany({ video: videoId }),
        await deleteFileFromImageKit(videoUrl,'curatube-videos'),
        await deleteFileFromImageKit(thumbnail,'curatube-thumbnails')
    ])
    //delete from db
    await Video.findByIdAndDelete(videoId);

    return res.status(200)
        .json(new ApiResponse(200, {}, "Video Deleted Successfully"));
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    const videoExists = await Video.findById(videoId);

    if (!videoExists) {
        throw new ApiError(400, "Video not found");
    }


    const toggleStatus = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: {
                isPublished: !(videoExists.isPublished),
            }
        },
        {
            new: true
        }
    )

    if (!toggleStatus) {
        throw new ApiError(400, "Failed to toggle publish status");
    }

    return res
        .status(200)
        .json(new ApiResponse(200,
            { isPublished: toggleStatus.isPublished },
            "Publish status updated successfully"));
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}