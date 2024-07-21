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
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id")
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
    if (!comment) throw new ApiError(400, 'Error while adding comment');
    res
        .status(201)
        .json(new ApiResponse(201, content, "Comment added successfully"))
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const { commentId } = req.params;
    const { content } = req.body
    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment id")
    }
    if (!content) {
        throw new ApiError(400, "Comment is required");
    }
    const comment = await Comment.findById(commentId)
    if (comment?.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(400, "only comment owner can edit their comment");
    }
    const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        {
            $set: { content }
        },
        { new: true }
    )
    if (!updatedComment) throw new ApiError(500, "Error updating comment");

    return res
        .status(200)
        .json(new ApiResponse(200, updatedComment, "Comment updated"));
});

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const {commentId} = req.params
    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment id")
    }
    const comment = await Comment.findById(commentId)
    if (comment?.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(400, "only comment owner can delete their comment");
    }
    await Comment.findByIdAndDelete(commentId);
    res
    .status(200)
    .json(new ApiResponse(200, null, "Comment deleted successfully"));
})

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}