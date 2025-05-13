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
    // get all videos based on query, sort, pagination

    const aggregationPipeline = []

    if (query) {
        if (process.env.NODE_ENV === "production") {
            aggregationPipeline.push({
                $search: {
                    index: "search-curatube-videos",//TODO: Create a search index in mongo atlas cloud
                    text: {
                        query: query,
                        path: ["title", "description"],
                    },
                },
            });
        } else {
            aggregationPipeline.push({
                $match: {
                    $or: [
                        { title: { $regex: query, $options: 'i' } },
                        { description: { $regex: query, $options: 'i' } },
                    ],
                },
            });
        }
    }


    if (userId) {
        if (!isValidObjectId(userId)) throw new ApiError(400, "invalid user id");
        aggregationPipeline.push({
            $match: {
                owner: userId
            }
        })
    }

    aggregationPipeline.push({
        $match: {
            isPublished: true
        }
    })

    if (sortBy && sortType) {
        aggregationPipeline.push({
            $sort: {
                [sortBy]: sortType === "asc" ? 1 : -1
            },
        });
    } else {
        aggregationPipeline.push({
            $sort: {
                createdAt: -1
            }
        })
    }


    aggregationPipeline.push(
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "ownerDetails",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            "avatar": 1,
                        },
                    },
                ],
            },
        },
        {
            $unwind: "$ownerDetails",
        }
    );

    const aggregatedVideos = Video.aggregate(aggregationPipeline);

    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
    }

    const allVideos = await Video.aggregatePaginate(aggregatedVideos, options);

    if (!allVideos) {
        throw new ApiError(400, "Failed to get all videos");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {
            videos: allVideos.docs
        }, "Videos fetched successfully"))

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
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id");
    }
    const videoExists = await Video.findById(videoId);


    if (!videoExists) throw new ApiError(400, "Video not found");
    const video = await Video.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(videoId),
            },
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "video",
                as: "likes",
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $lookup: {
                            from: "subscriptions",
                            localField: "_id",
                            foreignField: "channel",
                            as: "subscribers",
                        },
                    },
                    {
                        $addFields: {
                            subscribersCount: {
                                $size: "$subscribers",
                            },
                            isSubscribed: {
                                $in: [req.user?._id, "$subscribers.subscriber"],
                            },
                        },
                    },
                    {
                        $project: {
                            username: 1,
                            fullName: 1,
                            avatar: 1,
                            subscribersCount: 1,
                            isSubscribed: 1,
                        },
                    },
                ],
            },
        },
        {
            $addFields: {
                likesCount: {
                    $size: "$likes",
                },
                owner: {
                    $first: "$owner",
                },
                isLiked: {
                    $in: [req.user?._id, "$likes.likedBy"]
                },
            },
        },
        {
            $project: {
                videoFile: 1,
                thumbnail: 1,
                title: 1,
                description: 1,
                views: 1,
                createdAt: 1,
                duration: 1,
                comments: 1,
                owner: 1,
                likesCount: 1,
                isLiked: 1,
                isSubscribed: 1,
                subscribersCount: 1,
            },
        },
    ]);

    if (!video.length) throw new ApiError(404, "Failed to get video");


    return res.status(200)
        .json(new ApiResponse(200, {
            video: video[0]
        }, "Video fetched successfully"))
})



const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { title, description } = req.body;
    //TODO: update video details like title, description, thumbnail
    const video = await Video.findById(videoId);
    if (!video) throw new ApiError(400, "Video not found");

    const thumbnailLocalPath = req.file?.path;

    if (!(title || description || thumbnailLocalPath)) {
        throw new ApiError(400, "Atleast one field is required to update");
    }

    let newThumbnail;
    if (thumbnailLocalPath) {
        await deleteFileFromImageKit(video.thumbnail, 'curatube-thumbnails');
        newThumbnail = await uploadOnImageKit(thumbnailLocalPath, 'curatube-thumbnails');
    }

    let updateOptions = {
        title,
        description,
    }

    if (thumbnailLocalPath) updateOptions.thumbnail = newThumbnail.url;

    const updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: updateOptions
        },
        {
            new: true
        }
    )

    if (!updatedVideo) {
        throw new Error(400, "Failed to update video details");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updatedVideo, "Video Details Updated Successfully"));



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
        await deleteFileFromImageKit(videoUrl, 'curatube-videos'),
        await deleteFileFromImageKit(thumbnail, 'curatube-thumbnails')
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

const updateVideoViews = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id");
    }
    const videoExists = await Video.findById(videoId);

    if (!videoExists) throw new ApiError(400, "Video not found");

    const user = await User.findById(req.user._id);

    const alreadyWatched = user.watchHistory.find(
        (history) => history.video.toString() === videoId
    )

    if (alreadyWatched) {
        alreadyWatched.watchedAt = new Date();
        await user.save();
    } else {
        user.watchHistory.push({
            video: videoId,
            watchedAt: new Date()
        })
    }

    const updatedVideo = await Video.findByIdAndUpdate(videoId, {
        $inc: {
            views: 1
        }
    },{
        new:true
    })

    if (!updatedVideo) throw new ApiError(400, "Failed to update views");

    return res
        .status(200)
        .json(new ApiResponse(200, {
            video: updatedVideo,
            user
        }
            , "Views updated Successfully"))
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    updateVideoViews,
    togglePublishStatus
}