import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { Subscription } from "../models/subscription.model.js"
import { Like } from "../models/like.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    const channelId  = req.user._id


    const videoStats = await Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $group: {
                _id: null,
                totalViews: {
                    $sum: '$views'
                },
                totalVideos: {
                    $sum: 1
                }

            }
        }
    ])


    const totalLikes = await Like.aggregate([
        {
            $lookup: {
                from: 'videos',
                localField: 'video',
                foreignField: '_id',
                as: 'videoDetails'
            }
        },
        { $unwind: '$videoDetails' },
        {
            $match: {
                'videoDetails.owner': new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $group: {
                _id: null,
                totalLikes: { $sum: 1 }
            }
        }
    ])

    const totalSubscribers = await Subscription.countDocuments({
        channel: channelId
    })



    return res.status(200).json(new ApiResponse(200, {
        totalVideos: videoStats[0]?.totalVideos || 0,
        totalViews: videoStats[0]?.totalViews || 0,
        totalLikes: totalLikes[0]?.totalLikes || 0,
        totalSubscribers: totalSubscribers
    }, "Channel Stats fetched successfully"))
})

const getChannelVideos = asyncHandler(async (req, res) => {
    const channelId  = req.user._id

    const videos = await Video.aggregate([
        {
            $match:{
                owner: channelId
            }
        },
        {
            $lookup:{
                from:"likes",
                localField:'_id',
                foreignField:'video',
                as: 'videoLikes'
            }
        },
        {
            $addFields:{
                videoLikes:{
                    $size: '$videoLikes'
                }
            }
        },
        {
            $sort:{
                createdAt:-1
            }
        }  
    ])


    return res.status(200)
    .json(new ApiResponse(200,videos,"Channel videos fetched successfully"))

})

export {
    getChannelStats,
    getChannelVideos
}