import mongoose, { isValidObjectId } from "mongoose"
import { Tweet } from "../models/tweet.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const { content } = req.body
    const userId = req.user?._id;
    if (!content) {
        throw new ApiError(400, "Content is required")
    }

    const tweet = await Tweet.create(
        {
            content,
            owner: userId
        }
    )
    res
        .status(200)
        .json(new ApiResponse(200, tweet, "Tweet created successfully"))
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const { userId } = req.params;
    if (!isValidObjectId(userId)) throw new ApiError(400, "Invalid user id");

    const userExists = await User.findById(userId).select('-password -refreshToken -watchHistory -email');

    if(!userExists){
        throw new ApiError(400,"User not found");
    }


    const userTweets = await Tweet.find({
        owner:userId
    })

    if(!userTweets) {
        return res.status(200).json(new ApiResponse(400,{
            userDetails:userExists,
            tweets:[]
        },"Tweets fetched successfully"));
    }
    
    
    return res.status(200).json(new ApiResponse(400,{
        userDetails:userExists,
        tweets:userTweets
    },"Tweets fetched successfully"));

})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const { tweetId } = req.params
    const { content } = req.body

    if (!content)
        throw new ApiError(400, "Content is required")
    if (!isValidObjectId(tweetId))
        throw new ApiError(400, "Invalid tweet id")
    const tweet = await Tweet.findById(tweetId)
    if (!tweet)
        throw new ApiError(404, "Tweet not found")

    if (tweet?.owner.toString() !== req.user?._id.toString())
        throw new ApiError(403, "You are not authorized to update this tweet")
    const updatedTweet = await Tweet.findByIdAndUpdate(tweetId, {
        $set: { content }
    },
        { new: true }
    )

    res
        .status(200)
        .json(new ApiResponse(200, updatedTweet, "Tweet updated successfully"))
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const { tweetId } = req.params
    if (!isValidObjectId(tweetId))
        throw new ApiError(400, "Invalid tweet id")
    const tweet = await Tweet.findById(tweetId)
    if (!tweet)
        throw new ApiError(404, "Tweet not found")
    await Tweet.findByIdAndDelete(tweetId)
    res
        .status(200)
        .json(new ApiResponse(200, null, "Tweet deleted successfully"))
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}