import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const {userId} = req.params
    if(!mongoose.isValidObjectId(userId)){
        throw new ApiError(400,"Invalid user id")
    }
    const {comment} = req.body
    if(!comment){
        throw new ApiError(400,"Comment is required")
    }
    const user = await User.findById(userId)
    if(!user){
        throw new ApiError(404,"User not found")
    }
    const newComment = new Comment({comment,owner:userId})
    await newComment.save()
    res
    .status(201)
    .json(new ApiResponse(201,{comment:newComment},"Comment added successfully"))
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
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