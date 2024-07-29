import mongoose, { isValidObjectId } from "mongoose"
import { Playlist } from "../models/playlist.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"

const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body
    //TODO: create playlist
    if (!name) {
        throw new ApiError(400, "Name is required")
    }
    if (!description) {
        throw new ApiError(400, "Description is required")
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
    //TODO: get user playlists
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
            $lookup: {
                from: "videos",
                localField: "videos",
                foreignField: "_id",
                as: "videos"
            }
        },
        {
            $addFields: {
                totalVideos: { $size: "$videos" },
                totalDuration: { $sum: "$videos.duration" },
                totalViews: { $sum: "$videos.views" },
                coverImage: {
                    $let: {
                        vars: {
                            latestVideo: {
                                $arrayElemAt: [
                                    {
                                        $sortArray: {
                                            input: "$videos",
                                            sort: { createdAt: -1 }
                                        }
                                    }, 
                                    0
                                ]
                            }
                        },
                        $in: "$$latestVideo.thumbnail"
                    }
                }
            }
        },
        {
            $project: {
                _id: 1,
                name: 1,
                description: 1,
                totalVideos: 1,
                totalDuration: 1,
                totalViews: 1,
                coverImage: 1,
                createdAt: 1,
                updatedAt: 1,
            }
        }
    ])
    return res
        .status(200)
        .json(new ApiResponse(200, playlist, "User playlists retrieved successfully"))
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    //TODO: get playlist by id
})

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
    const video = Video.findById(videoId)
    if (!video) {
        throw new ApiError(404, "Video not found")
    }
    if (playlist?.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(400, "Only playlist owner can add videos to playlist")
    }
    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlist._id,
        {
            $addToSet: {
                videos: videoId
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
    // TODO: remove video from playlist
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
    const video = Video.findById(videoId)
    if (!video) {
        throw new ApiError(404, "Video not found")
    }
    if (playlist?.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(400, "Only playlist owner can remove videos from playlist")
    }
    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlist._id,
        {
            $pull: {
                vidoes: videoId
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
    // TODO: delete playlist
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
    const deletedPlaylist = await Playlist.findByIdAndDelete(playlistId)
    return res
        .status(200)
        .json(new ApiResponse(200, deletedPlaylist, "Playlist deleted successfully"))
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    const { name, description } = req.body
    //TODO: update playlist
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
    if (playlist?.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(400, "Only playlist owner can update playlist")
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