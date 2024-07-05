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
    if(!isValidObjectId(channelId)){
        throw new ApiError(400, "Invalid channel id")
    }
    const subsList = await Subscription.aggregate([
        {
            $match:{
                channel:mongoose.Types.ObjectId(channelId)
            
            },
        },
        {
            $lookup:{
                from:'users',
                localField:'subscriber',
                foreignField:'_id',
                as:'subscriber',
                pipeline:[
                    {
                        $project:{
                            _id:1,
                            name:1,
                            email:1,
                            profilePic:1
                        }
                    }
                ]
            },
        },
            {
                $unwind:'$subscriber',
            },
            {
                $project:{
                    _id:0,
                    subscriber:{
                        _id:1,
                        username:1,
                        email:1,
                        avatar:1
                    
                    },
                }
            
            }
        
    ])
    if(!subsList){
        throw new ApiError(404, "No subscribers found")
    }
    return res
    .status(200)
    .json( new ApiResponse(200,subsList, "Subscribers list fetched successfully"))
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