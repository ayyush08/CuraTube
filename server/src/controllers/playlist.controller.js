import mongoose, { isValidObjectId } from "mongoose"
import { Playlist } from "../models/playlist.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"

const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body
    if (!name) {
        throw new ApiError(400, "Name is required")
    }
    if (!description) {
        throw new ApiError(400, "Description is required")
    }
    const existingPlaylists = await Playlist.countDocuments({ owner: req.user._id })

    if (existingPlaylists === 10) {
        throw new ApiError(400, "We only allow a maximum of 10 playlists per user")
    }
    const playlist = await Playlist.create({
        name,
        description,
        owner: req.user._id

    })
    return res
        .status(200)
        .json(new ApiResponse(200, playlist, "Playlist created successfully"))
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params
    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user id")
    }



    const playlist = await Playlist.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $unwind: {
                path: "$videos",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "videos.video",
                foreignField: "_id",
                as: "videoDetails",
                pipeline: [
                    {
                        $project: {
                            title: 1,
                            thumbnail: 1,
                            owner: 1,
                            duration: 1,
                            views: 1,
                        }
                    }
                ]
            }
        },
        {
            $unwind: {
                path: "$videoDetails",
                preserveNullAndEmptyArrays: true

            }
        },
        {
            $lookup: {
                from: "users",
                localField: "videoDetails.owner",
                foreignField: "_id",
                as: "videoDetails.owner",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            fullName: 1,
                            avatar: 1,

                        }
                    }
                ]
            }
        },
        {
            $unwind: {
                path: "$videoDetails.owner",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $sort: {
                'videos.addedAt': -1
            }
        },
        {
            $project: {
                name: 1,
                description: 1,
                createdAt: 1,
                updatedAt: 1,
                owner: 1,
                videos: {
                    video: "$videoDetails",
                    addedAt: "$videos.addedAt"
                }
            }
        },
        {
            $group: {
                _id: "$_id",
                name: { $first: "$name" },
                owner: { $first: "$owner" },
                description: { $first: "$description" },
                createdAt: { $first: "$createdAt" },
                updatedAt: { $first: "$updatedAt" },
                videos: { $push: "$videos" },
                latestVideoThumbnail: { $first: "$videos.video.thumbnail" }
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        }
    ]
    )




    return res
        .status(200)
        .json(new ApiResponse(200, playlist, "User playlists retrieved successfully"))
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist id");
    }

    const playlist = await Playlist.findById(playlistId).lean();
    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    // If no videos, return metadata + empty videos
    if (!playlist.videos || playlist.videos.length === 0) {
        return res.status(200).json(new ApiResponse(200, {
            _id: playlist._id,
            name: playlist.name,
            description: playlist.description,
            createdAt: playlist.createdAt,
            updatedAt: playlist.updatedAt,
            videos: [],
            latestVideoThumbnail: 'https://dummyimage.com/640x360/000/fff&text=No+Thumbnail',
        }, "Empty playlist fetched successfully"));
    }

    // Else, run aggregation for enriched videos
    const playlistById = await Playlist.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(playlistId)
            }
        },
        {
            $unwind: "$videos"
        },
        {
            $lookup: {
                from: "videos",
                localField: "videos.video",
                foreignField: "_id",
                as: "videoDetails"
            }
        },
        {
            $unwind: "$videoDetails"
        },
        {
            $lookup: {
                from: "users",
                localField: "videoDetails.owner",
                foreignField: "_id",
                as: "videoDetails.owner",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            fullName: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },
        {
            $unwind: "$videoDetails.owner"
        },
        {
            $addFields: {
                isOwner: {
                    $eq: ['$owner', req.user._id]
                }
            }
        },
        {
            $match: {
                $or: [
                    { isOwner: true },
                    { 'videoDetails.isPublished': true }
                ]
            }
        },
        {
            $addFields: {
                'videos.video': '$videoDetails'
            }
        },
        {
            $sort: {
                'videos.addedAt': -1
            }
        },
        {
            $project: {
                name: 1,
                description: 1,
                createdAt: 1,
                updatedAt: 1,
                owner: 1,
                videos: {
                    video: "$videoDetails",
                    addedAt: "$videos.addedAt"
                },
                latestVideoThumbnail: "$videoDetails.thumbnail"
            }
        },
        {
            $group: {
                _id: "$_id",
                name: { $first: "$name" },
                owner: { $first: "$owner" },
                description: { $first: "$description" },
                createdAt: { $first: "$createdAt" },
                updatedAt: { $first: "$updatedAt" },
                videos: { $push: "$videos" },
                latestVideoThumbnail: { $first: "$latestVideoThumbnail" }
            }
        }
    ]);

    return res.status(200).json(
        new ApiResponse(200, playlistById[0], "Playlist fetched successfully")
    );
});


const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist id")
    }
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id")
    }
    const playlist = await Playlist.findById(playlistId)
    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }
    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    const videoAlreadyPresent = playlist.videos.find((item) => item.video.toString() === videoId)

    if (videoAlreadyPresent) throw new ApiError(400, "video already exists in this playlist")

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlist._id,
        {
            $addToSet: {
                videos: {
                    video: videoId,
                    addedAt: new Date()
                }
            },
        },
        { new: true }
    )
    if (!updatedPlaylist) {
        throw new ApiError(500, "Error adding video to playlist")
    }
    return res
        .status(200)
        .json(new ApiResponse(200, updatedPlaylist, "Video added to playlist successfully"))
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist id")
    }
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id")
    }
    const playlist = await Playlist.findById(playlistId)
    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }
    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiError(404, "Video not found")
    }
    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlist._id,
        {
            $pull: {
                videos: {
                    video: videoId
                }
            }
        },
        { new: true }
    )
    if (!updatedPlaylist) {
        throw new ApiError(500, "Error removing video from playlist")
    }
    return res
        .status(200)
        .json(new ApiResponse(200, updatedPlaylist, "Video removed from playlist successfully"))

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist id")
    }
    const playlist = await Playlist.findById(playlistId)
    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }
    if (playlist?.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(400, "Only playlist owner can delete playlist")
    }
    await Playlist.findByIdAndDelete(playlistId)
    return res
        .status(200)
        .json(new ApiResponse(200, null, "Playlist deleted successfully"))
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    const { name, description } = req.body
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist id")
    }
    if ([name, description].some((field) => !field)) {
        throw new ApiError(400, "Name and description are required")
    }
    const playlist = await Playlist.findById(playlistId)
    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }
    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $set: {
                name,
                description
            }
        },
        { new: true }
    )
    return res
        .status(200)
        .json(new ApiResponse(200, updatedPlaylist, "Playlist updated successfully"))
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}