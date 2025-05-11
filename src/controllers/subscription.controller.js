import mongoose, { isValidObjectId } from "mongoose"
import { User } from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params
    // TODO: toggle subscription
    const userId = req.user._id;
    if(!isValidObjectId(channelId)){
        throw new ApiError(400,"Invalid channel id");
    }
    if(channelId.toString()===userId.toString()){
        throw new ApiError(400,"You can't subscribe to yourself")
    }
    let isSubscribed = await Subscription.findOne({
        subscriber: userId,
        channel: channelId
    })

    if (isSubscribed) {
        await Subscription.findByIdAndDelete(isSubscribed?._id)
        return res
            .status(200)
            .json(new ApiResponse(200, {}, "Unsubscribed successfully"))
    }
    else {
        const subscribedChannel = await Subscription.create({
            subscriber: userId,
            channel: channelId
        })
        return res
            .status(200)
            .json(new ApiResponse(200, subscribedChannel, "Subscribed successfully"))
    }
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params
    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel id")
    }
    const subsList = await Subscription.aggregate([

    ])
    if (!subsList) {
        throw new ApiError(404, "No subscribers found")
    }
    return res
        .status(200)
        .json(new ApiResponse(200, subsList, "Subscribers list fetched successfully"))
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
    if (!isValidObjectId(subscriberId)) {
        throw new ApiError(400, "Invalid subscriber id")
    }
    const channelList = await Subscription.aggregate([

    ])
    if (!channelList) {
        throw new ApiError(404, "No subscribed channels found")
    }
    return res
        .status(200)
        .json(new ApiResponse(200, channelList, 'Subscribed channels fetched successfully'))
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}