import mongoose, { isValidObjectId } from "mongoose"
import { User } from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params
    const userId = req.user._id;
    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel id");
    }
    if (channelId.toString() === userId.toString()) {
        throw new ApiError(400, "You can't subscribe to yourself")
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

const getChannelSubscriberList = asyncHandler(async (req, res) => {
    const { channelId } = req.params
    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel id")
    }
    const subsList = await Subscription.aggregate([
        {
            $match: {
                channel: new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'subscriber',
                foreignField: '_id',
                as: 'subscriberDetails',
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            avatar: 1,
                            fullName: 1,
                            coverImage: 1
                        }
                    }
                ]
            }
        },
        {
            $unwind: '$subscriberDetails'
        }
    ])
    if (!subsList) {
        throw new ApiError(404, "No subscribers found")
    }
    return res
        .status(200)
        .json(new ApiResponse(200, subsList, "Subscribers list fetched successfully"))
})


const getSubscribedChannels = asyncHandler(async (req, res) => {
    const channelList = await Subscription.aggregate([
        {
            $match: {
                subscriber: req.user._id
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "channel",
                foreignField: "_id",
                as: "channelDetails",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            avatar: 1,
                            fullName: 1,
                            coverImage: 1
                        }
                    }
                ]
            }
        },
        {
            $unwind: "$channelDetails"
        }
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
    getChannelSubscriberList,
    getSubscribedChannels
}