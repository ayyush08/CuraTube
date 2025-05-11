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


    const isLiked = await Like.findOne(
        {
            video: videoId,
            likedBy: req.user?._id
        });
    if (isLiked) {
        await Like.findByIdAndDelete(isLiked._id);
        return res
            .status(200)
            .json(new ApiResponse(200, null, "Video unliked successfully"));
    }
    else {
        await Like.create({ video: videoId, likedBy: req.user?._id });
        return res
            .status(200)
            .json(new ApiResponse(200, null, "Video liked successfully"));

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
    const likedComment = await Like.findOne({ comment: commentId, likedBy: userId });
    if (likedComment) {
        await Like.findByIdAndDelete(likedComment._id)
        return res
            .status(200)
            .json(new ApiResponse(200, null, "Comment Unliked Successfully"));
    }
    else {
        await Like.create({ comment: commentId, likedBy: userId });
        return res
            .status(200)
            .json(new ApiResponse(200, null, "Comment Liked Successfully"));
    }

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params
    if(!isValidObjectId(tweetId)){
        throw new ApiError(400,"Invalid tweet id");
    }
    const userId = req.user?._id
    const likedTweet = await Like.findOne({ tweet: tweetId, likedBy: userId });

        if (likedTweet) {
            await Like.findByIdAndDelete(likedTweet._id);
            return res
                .status(200)
                .json(new ApiResponse(200, null, "Tweet Unliked Successfully"));
        }
        else {
            await Like.create({ tweet: tweetId, likedBy: userId });
            return res
                .status(200)
                .json(new ApiResponse(200, null, "Tweet Liked Successfully"))
        }
}


)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const userId = req.user?._id
    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid User Id")
    }
    const likedVideos = await Like.aggregate([
    //TODO
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