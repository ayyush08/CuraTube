import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from 'jsonwebtoken'
import mongoose from "mongoose";
import { deleteFileFromCloudinary, uploadToCloudinary } from "../utils/cloudinary.js";
import path from "path";


const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(500, 'Something went wrong while generating access and refresh tokens')
    }
}



const registerUser = asyncHandler(async (req, res) => {

    const { fullName, username, email, password } = req.body;
    console.log(email);
    if (
        [fullName, email, username, password].some((field) => !field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }],
    });
    if (existedUser) {
        throw new ApiError(409, "User already exists");
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path;
    }
    else {
        coverImageLocalPath = null;
    }

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required");
    }
    const now = Date.now();
    const avatarFolder = `curatube-avatars/${username}-${now}`;
    const avatarFileName = path.basename(avatarLocalPath);
    const avatarResult = await uploadToCloudinary(avatarLocalPath, avatarFolder, avatarFileName, 'image');

    const coverImageFolder = `curatube-cover-images/${username}-${now}`;
    const coverImageFileName = path.basename(coverImageLocalPath);
    const coverImageResult = await uploadToCloudinary(coverImageLocalPath, coverImageFolder, coverImageFileName, 'image');

    if (!avatarResult || !avatarResult.secure_url) {
        throw new ApiError(400, "Avatar upload failed");
    }

    if (coverImageLocalPath && (!coverImageResult || !coverImageResult.secure_url)) {
        throw new ApiError(400, "Cover Image upload failed");
    }

    const user = await User.create({
        fullName,
        avatar: avatarResult.secure_url,
        coverImage: coverImageResult?.secure_url || "",
        username: username.toLowerCase(),
        email,
        password,
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, "User not created");
    }

    return res
        .status(201)
        .json(new ApiResponse(200, createdUser, "User created successfully"));
});


const loginUser = asyncHandler(async (req, res) => {

    const { email, username, password } = req.body;

    if (!email && !username) {
        throw new ApiError(400, "Email or Username is required");
    }

    const user = await User.findOne({ $or: [{ email }, { username }] })

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid password");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)


    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true
    }

    res.cookie('accessToken', accessToken, options)
        .cookie('refreshToken', refreshToken, options)

    return res
        .status(200)

        .json(
            new ApiResponse(200, {
                user: loggedInUser,
                // accessToken,
                // refreshToken
            }, "User logged in successfully")
        )
})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie('accessToken', options)
        .clearCookie('refreshToken', options)
        .json(
            new ApiResponse(200, {}, 'User logged out successfully')
        )

})

const refreshAccessToken = asyncHandler(async (req, res) => {

    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;


    if (!incomingRefreshToken) {
        throw new ApiError(401, 'Unauthorized request');
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        const user = await User.findById(decodedToken?._id)

        if (!user) {
            throw new ApiError(401, 'Invalid Refresh Token');
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, 'Refresh Token is expired or used up');
        }

        const options = {
            httpOnly: true,
            secure: true,
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

        res.cookie('accessToken', accessToken, options)
            .cookie('refreshToken', refreshToken, options)

        return res
            .status(200)

            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken },
                    'Access token refreshed :)'
                )
            )
    } catch (error) {
        throw new ApiError(401, error?.message || 'Invalid refresh token')
    }
})

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body

    if (oldPassword === newPassword) {
        throw new ApiError(400, "New password can't be same as previous one")
    }

    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(400, 'Invalid old password');
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false })

    return res
        .status(200)
        .json(new ApiResponse(200, {}, 'Password Updated Successfully'))

})

const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(200, req.user, 'current user fetched successfully'))
})


const updateAccountDetails = asyncHandler(async (req, res) => {
    const { fullName, email, username } = req.body;
    if (!fullName || !email || !username) {
        throw new ApiError(400, 'All fields are required');
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName: fullName,
                email: email,
                username: username
            }
        },
        { new: true }
    ).select('-password')

    return res
        .status(200)
        .json(new ApiResponse(200, user, 'Account details successfully updated'))
})

const updateUserAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path
    if (!avatarLocalPath) {
        throw new ApiError(400, 'Avatar file is missing');
    }
    const now = Date.now();

    const existingUser = await User.findById(req.user?._id);

    const oldAvatar = existingUser.avatar;

    const avatarFolder = `curatube-avatars/${existingUser.username}-${now}`;
    const avatarFileName = path.basename(avatarLocalPath);
    const avatarResult = await uploadToCloudinary(avatarLocalPath, avatarFolder, avatarFileName, 'image');

    if (!avatarResult || !avatarResult.secure_url) {
        throw new ApiError(400, 'Error while uploading Avatar');
    }

    //delete existing file from imagekit
    if (oldAvatar) {

        await deleteFileFromCloudinary(oldAvatar, 'image');
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: avatarResult.secure_url
            }
        },
        { new: true }
    ).select('-password')

    return res
        .status(200)
        .json(new ApiResponse(200, user, 'Avatar Updated Successfully'))

})
const updateUserCoverImage = asyncHandler(async (req, res) => {
    const coverImageLocalPath = req.file?.path
    if (!coverImageLocalPath) {
        throw new ApiError(400, 'Cover Image file is missing');
    }
    const now = Date.now();
    const existingUser = await User.findById(req.user?._id);
    const oldcoverImage = existingUser.coverImage;
    const coverImageFolder = `curatube-cover-images/${existingUser.username}-${now}`;
    const coverImageFileName = path.basename(coverImageLocalPath);
    const coverImageResult = await uploadToCloudinary(coverImageLocalPath, coverImageFolder, coverImageFileName, 'image');

    if (!coverImageResult || !coverImageResult.secure_url) {
        throw new ApiError(400, 'Error while uploading Cover Image')
    }

    if (oldcoverImage) {
        await deleteFileFromCloudinary(oldcoverImage, 'image');
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                coverImage: coverImageResult.secure_url
            }
        },
        { new: true }
    ).select('-password')

    return res
        .status(200)
        .json(new ApiResponse(200, user, 'Cover Image Updated Successfully'))

})


const getUserChannelProfile = asyncHandler(async (req, res) => {
    const { username } = req.params;
    const { subscriberId } = req.query;
    const subscriberObjectId = subscriberId ? new mongoose.Types.ObjectId(subscriberId) : null;
    if (!username?.trim()) {
        throw new ApiError(400, 'Username is missing');
    }

    const channel = await User.aggregate([
        {
            $match: {
                username: username?.toLowerCase()
            }
        }, {
            $lookup: {
                from: 'subscriptions',
                localField: '_id',
                foreignField: 'channel',
                as: 'subscribers'
            }
        },
        {
            $lookup: {
                from: 'subscriptions',
                localField: '_id',
                foreignField: 'subscriber',
                as: 'subscribedTo'
            }
        },
        {
            $addFields: {
                subscribers: {
                    $size: '$subscribers'
                },
                channelsSubscribed: {
                    $size: '$subscribedTo'
                },
                isSubscribed: {
                    $cond: {
                        if: { $in: [subscriberObjectId, '$subscribers.subscriber'] },
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                fullName: 1,
                username: 1,
                subscribers: 1,
                channelsSubscribed: 1,
                isSubscribed: 1,
                avatar: 1,
                coverImage: 1,
                email: 1,
                createdAt: 1
            }
        }
    ])

    if (!channel?.length) {
        throw new ApiError(400, 'Channel does not exists')
    }

    return res
        .status(200)
        .json(new ApiResponse(200, channel[0], 'Channel fetched Successfully'))
})

const getWatchHistory = asyncHandler(async (req, res) => {
    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            },

        },
        {
            $unwind: "$watchHistory"
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory.video",
                foreignField: "_id",
                as: "videoDetails"
            }
        },
        {
            $unwind: "$videoDetails"
        },
        {
            $addFields: {
                isOwner: {
                    $eq: ["$videoDetails.owner", new mongoose.Types.ObjectId(req.user._id)]
                }
            }
        },
        // include published videos of others OR all videos of self
        {
            $match: {
                $or: [
                    { isOwner: true },
                    { "videoDetails.isPublished": true }
                ]
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
            $unwind: "$videoDetails.owner"
        },
        {
            $sort: {
                'watchHistory.watchedAt': -1
            }
        },
        {
            $project: {
                username: 1,
                email: 1,
                fullName: 1,
                avatar: 1,
                coverImage: 1,
                createdAt: 1,
                updatedAt: 1,
                watchHistory: {
                    video: "$videoDetails",
                    watchedAt: "$watchHistory.watchedAt"
                }
            }
        },
        {
            $group: {
                _id: "$_id",
                username: { $first: "$username" },
                email: { $first: "$email" },
                fullName: { $first: "$fullName" },
                avatar: { $first: "$avatar" },
                coverImage: { $first: "$coverImage" },
                createdAt: { $first: "$createdAt" },
                updatedAt: { $first: "$updatedAt" },
                watchHistory: { $push: "$watchHistory" }
            }
        }

    ])

    if (!user.length) {
        return res.status(200).json(new ApiResponse(200, [], "Watch History fetched successfully"))
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                user[0].watchHistory,
                'Watch History fetched successfully'
            )
        )
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getWatchHistory
};
