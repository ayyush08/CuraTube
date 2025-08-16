import mongoose from "mongoose"
import { Video } from "../models/video.model.js"
import { Subscription } from "../models/subscription.model.js"
import { Like } from "../models/like.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js"
import { Comment } from "../models/comment.model.js"
const getChannelStats = asyncHandler(async (req, res) => {
    const channelId = req.user._id



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

    const totalVideosWatched = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $unwind: '$watchHistory'
        },
        {
            $group: {
                _id: null,
                totalVideosWatched: { $sum: 1 }
            }
        }
    ])


    const totalComments = await Comment.aggregate([
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "videoDetails"
            }
        },
        { $unwind: "$videoDetails" },
        {
            $match: {
                "videoDetails.owner": new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $group: {
                _id: null,
                totalComments: { $sum: 1 }
            }
        }
    ]);
    let totalViews = 0

    if (videoStats[0]?.totalViews >= 1000000) {
        totalViews = `${(videoStats[0]?.totalViews / 1000000).toFixed(1)}M`
    } else if (videoStats[0]?.totalViews >= 1000) {
        totalViews = `${(videoStats[0]?.totalViews / 1000).toFixed(1)}K`
    } else {
        totalViews = `${videoStats[0]?.totalViews} view${videoStats[0]?.totalViews !== 1 ? "s" : ""}`
    }


    const stats = [
        {
            title: "Total Videos",
            description: "The total number of videos uploaded to your channel.",
            value: videoStats[0]?.totalVideos || 0,
            type: "video"
        },
        {
            title: "Total Views",
            description: "The total number of views across all your videos.",
            value: totalViews || 0,
            type: "view"
        },
        {
            title: "Total Likes",
            description: "The total number of likes across all your videos.",
            value: totalLikes[0]?.totalLikes || 0,
            type: "like"
        },
        {
            title: "Total Subscribers",
            description: "The total number of subscribers to your channel.",
            value: totalSubscribers,
            type: "subscriber"
        },
        {
            title: "Total Videos Watched",
            description: "The total number of videos you have watched.",
            value: totalVideosWatched[0]?.totalVideosWatched || 0,
            type: "watch"
        },
        {
            title: "Total Comments",
            description: "The total number of comments on your videos.",
            value: totalComments[0]?.totalComments || 0,
            type: "comment"
        }
    ]

    return res.status(200).json(new ApiResponse(200, stats, "Channel Stats fetched successfully"))
})

const getChannelVideos = asyncHandler(async (req, res) => {
    const channelId = req.user._id;

    const videos = await Video.aggregate([
        {
            $match: {
                owner: channelId
            }
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "video",
                as: "videoLikes"
            }
        },
        {
            $addFields: {
                videoLikes: { $size: "$videoLikes" }
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            avatar: 1,
                            fullName: 1
                        }
                    }
                ]
            }
        },
        {
            $unwind: "$owner"
        },
        {
            $sort: {
                createdAt: -1
            }
        },
        {
            $limit: 5
        }
    ]);

    return res
        .status(200)
        .json(new ApiResponse(200, videos, "Channel videos fetched successfully"));
});




export {
    getChannelStats,
    getChannelVideos
}