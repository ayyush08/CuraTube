import mongoose from "mongoose"
import { Comment } from "../models/comment.model.js"
import { Video } from '../models/video.model.js'
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { isValidObjectId } from "mongoose"
const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const { videoId } = req.params
    const { page = 1, limit = 10 } = req.query

})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const { videoId } = req.params
    const { content } = req.body
    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user id")
    }
    if (!content) {
        throw new ApiError(400, "Comment is required")
    }
    const video = Video.findById(videoId)
    if (!video) {
        throw new ApiError(404, "Video not found")
    }
    const comment = await Comment.create({
        video: videoId,
        content,
        owner: req.user._id,
    });
    await comment.save()
    res
        .status(201)
        .json(new ApiResponse(201, { comment: newComment }, "Comment added successfully"))
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const { videoId } = req.params;
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid user id")
    }
    const comment = req.body
    if (!comment) {
        throw new ApiError(400, "Comment is required");
    }
    if(Comment.owner.toString()!==req.user?._id.toString()){
        throw new ApiError(400, "only comment owner can edit their comment");
    }
    const user = User.findById(userId)
    if (!user) {
        throw new ApiError(404, 'User not found')
    }
    const updatedComment = await Comment.findByIdAndUpdate()
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
})

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}