import mongoose from "mongoose"
import { Comment } from "../models/comment.model.js"
import { Video } from '../models/video.model.js'
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { isValidObjectId } from "mongoose"
const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { page = 1, limit = 10 ,sortBy = 'createdAt'} = req.query

    if (!isValidObjectId(videoId)) throw new ApiError(400, "Invalid Video Id");

    const videoExists = await Video.findById(videoId);
    if (!videoExists) throw new ApiError(400, "Video not found")

    const commentsAggregate = Comment.aggregate([{
        $match: {
            video: new mongoose.Types.ObjectId(videoId)
        }
    },
    {
        $lookup: {
            from: 'users',
            localField: 'owner',
            foreignField: '_id',
            as: 'owner',
            pipeline: [
                {
                    $project: {
                        username: 1,
                        avatar: 1,
                        fullName: 1,
                    }
                }
            ]
        }
    }, {
        $unwind: '$owner'
    }, 
    {
        $lookup: {
            from: 'likes',
            localField: '_id',
            foreignField: 'comment',
            as: 'likedBy',
            pipeline: [
                {
                    $project: {
                        _id: 0,
                        likedBy: 1
                    }
                }
            ]
        }
    },
    {
        $sort: {
            [sortBy]: -1
        }
    },
    {
        $project:{
            _id:1,
            comment: 1,
            createdAt: 1,
            updatedAt: 1,
            owner:1,
            likedBy:1
        }   
    }
    ])

    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10)
    }

    const comments = await Comment.aggregatePaginate(commentsAggregate, options);

    return res
        .status(200)
        .json(new ApiResponse(200, comments.docs, "Comments retrieved successfully"))

})

const addComment = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { content } = req.body

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id");
    }

    if (!content) {
        throw new ApiError(400, "Comment is required")
    }
    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiError(404, "Video not found")
    }
    const comment = await Comment.create({
        video: videoId,
        comment: content,
        owner: req.user._id,
    });
    if (!comment) throw new ApiError(400, 'Error while adding comment');
    res
        .status(201)
        .json(new ApiResponse(201, content, "Comment added successfully"))
})

const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment id");
    }

    if (!content) {
        throw new ApiError(400, "Comment is required");
    }
    const comment = await Comment.findById(commentId)

    if (!comment) {
        throw new ApiError(400, "Comment not found");
    }

    const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        {
            $set: { comment: content }
        },
        { new: true }
    )
    if (!updatedComment) throw new ApiError(500, "Error updating comment");

    return res
        .status(200)
        .json(new ApiResponse(200, updatedComment, "Comment updated"));
});

const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params
    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment id")
    }
    const comment = await Comment.findById(commentId)

    if (!comment) {
        throw new ApiError(400, "Comment not found");
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