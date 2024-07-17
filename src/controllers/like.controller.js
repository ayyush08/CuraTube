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
    try {
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
    } catch (error) {
        throw new ApiError(501,error.message || "Error occured while liking/unliking video");
        
    }
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment
    const userId = req.user?._id
    const likedComment = Like.findOne({comment:commentId,likedBy:userId});
    try {
        if(likedComment){
            await Like.findByIdAndDelete(likedComment._id)
            return res
            .status(200)
            .json(new ApiResponse(200,null,"Comment Liked Successfully"));
        }
        else{
            await Like.create({comment:commentId,likedBy:userId});
            return res
            .status(200)
            .json(new ApiResponse(200,null,"Comment Unliked Successfully"));
        }
    } catch (error) {
        throw new ApiError(501,error.message || "Error occured while liking/unliking comment");
    }
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    const userId = req.user?._id
    const likedTweet = Like.findOne({tweet:tweetId,likedBy:userId});
    try {
        if(likedTweet){
            await Like.findByIdAndDelete(likedTweet._id);
            return res
            .status(200)
            .json(new ApiResponse(200,null,"Tweet Unliked Successfully"));
        }
        else{
            await Like.create({tweet:tweetId,likedBy:userId});
            return res
            .status(200)
            .json(new ApiResponse(200,null,"Tweet Liked Successfully"))}
    } catch (error) {
        console.log("Error while toggling tweet likes",error);
    }
    }
    //TODO: toggle like on tweet

)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const userId = req.user?._id
    if(!isValidObjectId(userId)){
        throw new ApiError(400,"Invalid User Id")
    } 
    const likedVideos = await Like.aggregate([
        {
            $match:{
                likedBy: new mongoose.Types.ObjectId(userId)
            },

        },
        {
            $lookup:{
                from:'videos',
                localField:'video',
                foreignField:'_id',
                as:'likedVideo',
                pipeline:[
                    {
                        $match:{
                        isPublished:true
                        }, 
                    },
                    {
                        $lookup:{
                            from:'users',
                            localField:'owner',
                            foreignField:'_id',
                            as:'ownerDetails'
                        }
                    },
                    {
                        $unwind:'$ownerDetails'
                    }
                ],

            }
        },
        {
            $unwind: '$likedVideo'
        },
        {   
            $sort:{
                createdAt:-1
            } 
        },
        {
            $project:{
                _id:0,
                likedVideo:{
                    _id:1,
                    "video.url":1,
                    "thumbnail.url":1,
                    owner:1,
                    title:1,
                    description:1,
                    duration:1,
                    views:1,
                    createdAt:1,
                    isPublished:1,
                    ownerDetails:{
                        username:1,
                        fullName:1,
                        "avatar.url":1,

                    }
                }
            }
        }

    ])

    return res
    .status(200)
    .json(new ApiResponse(200,likedVideos,"Liked Videos Fetched Successfully"))

})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}