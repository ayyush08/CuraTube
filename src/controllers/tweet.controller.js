import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    try {
        const {content,userId} = req.body

        if(!content){
            throw new ApiError(400,"Content is required")
        }
        if(!isValidObjectId(userId)){
            throw new ApiError(400,"Invalid user id")
        }
        const user = await User.findById(userId);
        if(!user){
            throw new ApiError(404,"User not found")
        }
        const tweet = new Tweet({content:content,owner:userId})
        await tweet.save()
        res
        .status(200)
        .json(new ApiResponse(200,{tweet},"Tweet created successfully"))
    } catch (error) {
        throw new ApiError(500,error.message||'Something went wrong');
    }
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const userId = req.params.userId
    if(!isValidObjectId(userId)){
        throw new ApiError(400,"Invalid user id")
    }
    const { page = 1, limit = 10 } = req.query;
    const aggregationPipeline = [
    //COMPLETE THIS
    ]
    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
    };
    const tweets = await Tweet.aggregatePaginate(Tweet.aggregate(aggregationPipeline),options)
    res
    .status(200)
    .json(new ApiResponse(200,tweets,"User tweets fetched successfully"))
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const {tweetId} = req.params
    const {content}= req.body

    if(!content)
        throw new ApiError(400,"Content is required")
    if(!isValidObjectId(tweetId))
        throw new ApiError(400,"Invalid tweet id")
    const tweet = await Tweet.findById(tweetId)
    if(!tweet)
        throw new ApiError(404,"Tweet not found")

    if(tweet?.owner.toString()!==req.user?._id.toString())
        throw new ApiError(403,"You are not authorized to update this tweet")
    const updatedTweet = await Tweet.findByIdAndUpdate(tweetId,{
        $set:{ content }
    },
        { new:true }
    )

    res
    .status(200)
    .json(new ApiResponse(200,updatedTweet,"Tweet updated successfully"))
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const {tweetId} = req.params
    if(!isValidObjectId(tweetId))
        throw new ApiError(400,"Invalid tweet id")
    const tweet = await Tweet.findById(tweetId)
    if(!tweet)
        throw new ApiError(404,"Tweet not found")
    await Tweet.findByIdAndDelete(tweetId)
    res
    .status(200)
    .json(new ApiResponse(200,null,"Tweet deleted successfully"))
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}