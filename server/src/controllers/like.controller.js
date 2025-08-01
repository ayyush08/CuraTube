import mongoose, { isValidObjectId } from "mongoose"
import { Like } from "../models/like.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"
import { Comment } from "../models/comment.model.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id")
    }

    const videoExists = await Video.findById(videoId);

    if (!videoExists) throw new ApiError(400, "Video not found");

    const totalLikes = await Like.countDocuments({ video: videoId })

    const isLiked = await Like.findOne(
        {
            video: videoId,
            likedBy: req.user?._id
        });
    if (isLiked) {
        await Like.findByIdAndDelete(isLiked._id);
        return res
            .status(200)
            .json(new ApiResponse(200, {
                liked: false,
                likeCount: totalLikes - 1 < 0 ? 0 : totalLikes - 1
            }, "Video unliked successfully"));
    }
    else {
        await Like.create({ video: videoId, likedBy: req.user?._id });
        return res
            .status(200)
            .json(new ApiResponse(200, {
                liked: true,
                likeCount: totalLikes + 1 < 0 ? 0 : totalLikes + 1
            }, "Video liked successfully"));

    }

})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params
    const userId = req.user?._id

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment id");
    }
    const commentExist = await Comment.findById(commentId);
    if (!commentExist) {
        throw new ApiError(400, "Comment not found");
    }
    const totalLikes = await Like.countDocuments({ comment: commentId });
    const isLiked = await Like.findOne({ comment: commentId, likedBy: userId });
    if (isLiked) {
        await Like.findByIdAndDelete(isLiked._id);
        return res
            .status(200)
            .json(new ApiResponse(200, {
                commentId,
                liked: false,
                likeCount: totalLikes < 0 ? 0 : totalLikes - 1
            }, "Comment Unliked Successfully"));
    }
    else {
        await Like.create({ comment: commentId, likedBy: userId });
        return res
            .status(200)
            .json(new ApiResponse(200, {
                commentId,
                liked: true,
                likeCount: totalLikes + 1 < 0 ? 0 : totalLikes + 1
            }, "Comment Liked Successfully"))
    }
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params
    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet id");
    }
    const userId = req.user?._id
    const totalLikes = await Like.countDocuments({ tweet: tweetId });
    const isLiked = await Like.findOne(
        {
            tweet: tweetId,
            likedBy: userId
        })

    if (isLiked) {
        await Like.findByIdAndDelete(isLiked._id);
        return res
            .status(200)
            .json(new ApiResponse(200, {
                liked: false,
                likeCount: totalLikes < 0 ? 0 : totalLikes - 1
            }, "Tweet Unliked Successfully"));
    }
    else {
        await Like.create({ tweet: tweetId, likedBy: userId });
        return res
            .status(200)
            .json(new ApiResponse(200, {
                liked: true,
                likeCount: totalLikes + 1 < 0 ? 0 : totalLikes + 1
            }, "Tweet Liked Successfully"))
    }
}


)

const getLikedVideos = asyncHandler(async (req, res) => {

    const likedVideos = await Like.aggregate([
        {
            $match: {
                likedBy: req.user._id
            }
        },
        {
            $lookup: {
                from: 'videos',
                localField: 'video',
                foreignField: '_id',
                as: 'videoDetails'
            }
        },
        {
            $unwind: '$videoDetails'
        },
        {
            $addFields: {
                isOwner: {
                    $eq: ['$videoDetails.owner', req.user._id]
                }
            }
        },
        {
            $match: {
                $or: [
                    { isOwner: true },
                    { 'videoDetails.isPublished': true }
                ]
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "videoDetails.owner",
                foreignField: "_id",
                as: "videoDetails.owner",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            fullName: 1,
                            avatar: 1,

                        }
                    }
                ]
            }
        },
        {
            $unwind: "$videoDetails.owner"
        },
        {
            $sort: {
                createdAt: -1
            }
        }
    ])

    return res
        .status(200)
        .json(new ApiResponse(200, likedVideos, "Liked Videos Fetched Successfully"))

})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}