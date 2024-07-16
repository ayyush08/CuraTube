import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video
    const userId = req.user?._id
    const isLiked = await Like.findOne({video:videoId,likedBy:userId});
    if(isLiked){
        await Like.findByIdAndDelete(isLiked._id);
        return res
        .status(200)
        .json(new ApiResponse(200, null, "Video unliked successfully"));
    }
    else{
        await Like.create({video:videoId,likedBy:userId});
        return res
        .status(200)
        .json(new ApiResponse(200, null,"Video liked successfully" ));

    }
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}