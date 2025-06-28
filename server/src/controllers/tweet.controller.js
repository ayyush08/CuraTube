import mongoose, { isValidObjectId } from "mongoose"
import { Tweet } from "../models/tweet.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    const { content } = req.body
    const userId = req.user?._id;
    if (!content) {
        throw new ApiError(400, "Content is required")
    }

    const tweet = await Tweet.create(
        {
            content,
            owner: userId
        }
    )
    res
        .status(200)
        .json(new ApiResponse(200, tweet, "Tweet created successfully"))
})

const getTweets = asyncHandler(async (req, res) => {
    const {
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        userId,
        sortType = 'desc',
    } = req.query;

    const pipeline = [];



    if (userId) {
        if (!isValidObjectId(userId)) {
            throw new ApiError(400, "Invalid user ID");
        }
        pipeline.push({
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        });
    }



    pipeline.push({
        $sort: {
            [sortBy]: sortType === 'asc' ? 1 : -1,
        },
    });


    pipeline.push(
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
            },
        },
        { $unwind: "$owner" },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "tweet",
                as: "likedBy",
                pipeline: [
                    {
                        $project: {
                            likedBy: 1,
                            _id: 0
                        }
                    }
                ]
            }
        },
        {
            $project: {
                content: 1,
                isLiked: 1,
                createdAt: 1,
                updatedAt: 1,
                owner: 1,
                likedBy:1
            }
        }
    );


    const tweetsAggregate = Tweet.aggregate(pipeline);

    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
    };

    const allTweets = await Tweet.aggregatePaginate(tweetsAggregate, options);

    if (!allTweets || allTweets.docs.length === 0) {
        const fakeTweet = (i) => ({
            _id: `${page}-${i}`,
            content: `Fake tweet ${page}-${i}`,
            likes: Math.floor(Math.random() * 100),
            owner: {
                username: `User${i}`,
                avatar: null,
                fullName: `User FullName ${i}`
            },
            createdAt: new Date(),
        });

        const fakeTweets = Array.from({ length: options.limit }, (_, i) => fakeTweet(i));

        return res.status(200).json(new ApiResponse(200, {
            tweets: fakeTweets
        }, "No real tweets found. Returning dummy tweets."));
    }

    return res.status(200).json(new ApiResponse(200, {
        tweets: allTweets.docs
    }, "Tweets fetched successfully"));
});


const updateTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params
    const { content } = req.body

    if (!content)
        throw new ApiError(400, "Content is required")
    if (!isValidObjectId(tweetId))
        throw new ApiError(400, "Invalid tweet id")
    const tweet = await Tweet.findById(tweetId)
    if (!tweet)
        throw new ApiError(404, "Tweet not found")

    if (tweet?.owner.toString() !== req.user?._id.toString())
        throw new ApiError(403, "You are not authorized to update this tweet")
    const updatedTweet = await Tweet.findByIdAndUpdate(tweetId, {
        $set: { content }
    },
        { new: true }
    )

    res
        .status(200)
        .json(new ApiResponse(200, updatedTweet, "Tweet updated successfully"))
})

const deleteTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params
    if (!isValidObjectId(tweetId))
        throw new ApiError(400, "Invalid tweet id")
    const tweet = await Tweet.findById(tweetId)
    if (!tweet)
        throw new ApiError(404, "Tweet not found")
    await Tweet.findByIdAndDelete(tweetId)
    res
        .status(200)
        .json(new ApiResponse(200, null, "Tweet deleted successfully"))
})

export {
    createTweet,
    updateTweet,
    deleteTweet,
    getTweets
}