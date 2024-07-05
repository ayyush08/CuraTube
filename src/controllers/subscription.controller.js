import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription
    const userId = req.user._id;
    if(userId.toHexString() === channelId){
        throw new ApiError(400, "You can't subscribe to yourself")
    }

    let isSubscribed = await Subscription.findOne({
        subscriber: userId,
        channel:channelId
    })

    if(isSubscribed){
        await Subscription.findByIdAndDelete(isSubscribed?._id)
        return res
        .status(200)
        .json(new ApiResponse(200,{}, "Unsubscribed successfully"))
    }
    else{
        await Subscription.create({
            subscriber:userId,
            channel:channelId
        })
        return res
        .status(200)
        .json(new ApiResponse(200,{}, "Subscribed successfully"))
    }
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}