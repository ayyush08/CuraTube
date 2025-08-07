
import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import fs from 'fs-extra';
import { Like } from "../models/like.model.js"
import { Comment } from "../models/comment.model.js"
import { deleteFileFromCloudinary } from '../utils/cloudinary.js';

import { inngest } from '../inngest/client.js';
const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query = '', sortBy = 'createdAt', sortType = 'desc', userId } = req.query

    const aggregationPipeline = []

    if (query) {
        if (process.env.NODE_ENV === "production") {
            aggregationPipeline.push({
                $search: {
                    index: "search-curatube-videos",//TODO: Create a search index in mongo atlas cloud for production
                    autocomplete: {
                        query: query,
                        path: ["title", "description"],
                    },
                },
            });
        } else {
            //using regex for lightweight testin in development
            aggregationPipeline.push({
                $match: {
                    $or: [
                        { title: { $regex: query, $options: 'i' } },
                        { description: { $regex: query, $options: 'i' } },
                    ],
                },
            });
        }
    }


    if (userId) {
        if (!isValidObjectId(userId)) throw new ApiError(400, "invalid user id");
        aggregationPipeline.push({
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        })
    }

    aggregationPipeline.push({
        $match: {
            isPublished: true,
            status: "ready" 
        }
    })

    if (sortBy && sortType) {
        aggregationPipeline.push({
            $sort: {
                [sortBy]: sortType === "asc" ? 1 : -1
            },
        });
    } else {
        aggregationPipeline.push({
            $sort: {
                createdAt: -1
            }
        })
    }


    aggregationPipeline.push(
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
                            "avatar": 1,
                            "fullName": 1,
                        },
                    },
                ],
            },
        },
        {
            $unwind: "$owner",
        }
    );

    const aggregatedVideos = Video.aggregate(aggregationPipeline);

    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
    }

    const allVideos = await Video.aggregatePaginate(aggregatedVideos, options);

    if (!allVideos) {
        throw new ApiError(400, "Failed to get all videos");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {
            videos: allVideos.docs
        }, "Videos fetched successfully"))

})

//I took help from chatgpt to write this function (🫠 )
// It is a bit complex but it works well for transcoding video to HLS format for bitrate streaming
// const publishAVideo = asyncHandler(async (req, res) => {
//     const { title, description, isPublished } = req.body;

//     if (!title || !description) {
//         throw new ApiError(400, "All fields are required");
//     }

//     let videoLocalPath;
//     let thumbnailLocalPath;

//     if (req.files) {
//         if (Array.isArray(req.files.videoFile) && req.files.videoFile.length > 0) {
//             videoLocalPath = req.files.videoFile[0]?.path;
//         } else {
//             throw new ApiError(400, "Video is required");
//         }

//         if (Array.isArray(req.files.thumbnail) && req.files.thumbnail.length > 0) {
//             thumbnailLocalPath = req.files.thumbnail[0]?.path;
//         } else {
//             await fs.remove(videoLocalPath);
//             throw new ApiError(400, "Thumbnail is required");
//         }
//     }
//     const now = Date.now();
//     const assetPublicIds = [];
//     console.log('✅ Starting local HLS transcoding');

//     const hlsOutputDir = path.join('./public/temp', `hls-${now}`);
//     await fs.ensureDir(hlsOutputDir);

//     const absoluteVideoPath = path.resolve(videoLocalPath);
//     const videoDuration = await getVideoDuration(absoluteVideoPath);
//     if (!await fs.pathExists(absoluteVideoPath)) {
//         throw new ApiError(400, `File not found on server: ${absoluteVideoPath}`);
//     }

//     await transcodeToHLS(absoluteVideoPath, hlsOutputDir);

//     console.log('✅ HLS transcoding completed');

//     const hlsFiles = await fs.readdir(hlsOutputDir);
//     console.log('📂 HLS output dir contents:', hlsFiles);


//     // === Upload segments first ===
//     const segmentUrlMap = {};
//     const segmentUploadResults = [];
//     for (const file of hlsFiles) {
//         const ext = path.extname(file).toLowerCase();
//         if (ext === '.m3u8') continue;

//         const localPath = path.join(hlsOutputDir, file);
//         const result = await uploadToCloudinary(localPath, `curatube-videos/${title}-${now}`, file, 'video');

//         if (!result) {
//             throw new ApiError(500, `Failed to upload segment: ${file}`);
//         }

//         segmentUrlMap[file] = result.secure_url;
//         segmentUploadResults.push(result);
//         assetPublicIds.push({
//             public_id: result.public_id,
//             resource_type: result.resource_type
//         })
//     }

//     console.log('✅ All .ts segments uploaded:', segmentUrlMap);

//     // === Rewrite .m3u8 playlist to absolute URLs ===
//     const playlistFile = hlsFiles.find(f => f.endsWith('.m3u8'));
//     if (!playlistFile) {
//         throw new ApiError(500, 'No playlist (.m3u8) file found in HLS output');
//     }

//     const playlistPath = path.join(hlsOutputDir, playlistFile);
//     await rewriteM3U8Playlist(playlistPath, segmentUrlMap);

//     console.log('✅ Playlist file rewritten with absolute URLs');

//     // === Upload playlist ===
//     const playlistResult = await uploadToCloudinary(playlistPath, `curatube-videos/${title}-${now}`, playlistFile, 'raw');

//     if (!playlistResult) {
//         // Cleanup segments if playlist upload fails
//         await Promise.all(assetPublicIds.map(async (asset) => {
//             await deleteFileFromCloudinary(asset.public_id, asset.resource_type);
//         }));
//         throw new ApiError(500, 'Playlist upload failed');
//     }

//     console.log('✅ Playlist uploaded:', playlistResult.secure_url);
//     assetPublicIds.push({
//         public_id: playlistResult.public_id,
//         resource_type: playlistResult.resource_type
//     });
//     // Upload thumbnail
//     console.log('🚀 Uploading thumbnail to Cloudinary...');
//     const thumbnailFolder = `curatube-thumbnails/${title}-${now}`;
//     const thumbnailFileName = path.basename(thumbnailLocalPath);
//     const thumbnailResult = await uploadToCloudinary(thumbnailLocalPath, thumbnailFolder, thumbnailFileName, 'image');

//     if (!thumbnailResult) {
//         console.error('❌ Thumbnail upload failed');

//         // Clean up all uploaded HLS segments
//         await Promise.all(assetPublicIds.map(async (asset) => {
//             await deleteFileFromCloudinary(asset.public_id, asset.resource_type);
//         }));

//         await fs.remove(hlsOutputDir);
//         await fs.remove(absoluteVideoPath);
//         await fs.remove(thumbnailLocalPath);

//         throw new ApiError(500, "Thumbnail upload failed");
//     }

//     console.log('✅ Thumbnail uploaded:', thumbnailResult.secure_url);
//     assetPublicIds.push({
//         public_id: thumbnailResult.public_id,
//         resource_type: thumbnailResult.resource_type
//     });
//     // Clean up local temp
//     await fs.remove(hlsOutputDir);
//     await fs.remove(absoluteVideoPath);
//     await fs.remove(thumbnailLocalPath);


//     const createdVideo = await Video.create({
//         title,
//         description,
//         videoFile: playlistResult.secure_url,
//         thumbnail: thumbnailResult.secure_url,
//         duration: Math.round(videoDuration),
//         isPublished,
//         asset_public_ids: assetPublicIds,
//         owner: req?.user._id,
//     });

//     if (!createdVideo) {
//         await Promise.all(assetPublicIds.map(async (asset) => {
//             await deleteFileFromCloudinary(asset.public_id, asset.resource_type);
//         }));
//         throw new ApiError(400, "Failed to upload video");

//     }

//     return res
//         .status(200)
//         .json(new ApiResponse(200, { video: createdVideo }, "Video Published Successfully"));
// });

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description, isPublished } = req.body;

    if (!title || !description) {
        throw new ApiError(400, "All fields are required");
    }

    let videoLocalPath, thumbnailLocalPath;

    if (req.files?.videoFile?.[0]) {
        videoLocalPath = req.files.videoFile[0].path;
    } else {
        throw new ApiError(400, "Video file is required");
    }

    if (req.files?.thumbnail?.[0]) {
        thumbnailLocalPath = req.files.thumbnail[0].path;
    } else {
        await fs.remove(videoLocalPath);
        throw new ApiError(400, "Thumbnail is required");
    }

    const now = Date.now();
    const video = await Video.create({
        title,
        description,
        videoFile: "", // Empty for now
        thumbnail: "",
        duration: 0,
        isPublished,
        asset_public_ids: [],
        status: "processing",
        owner: req.user._id
    });

    // Fire Inngest event
    await inngest.send({
        name: "video/publish",
        data: {
            videoId: video._id,
            title,
            now,
            videoLocalPath,
            thumbnailLocalPath,
        },
    });

    res.status(202).json(
        new ApiResponse(202, { videoId: video._id }, "Video upload started")
    );
});

const getVideoUploadStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id");
    }

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    return res.status(200).json(
        new ApiResponse(200, {
            status: video.status,
        }, "Video upload status fetched successfully")
    );

});

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { username } = req.query
    //TODO: get video by id
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id");
    }
    const videoExists = await Video.findById(videoId);
    const userExists = await User.findOne({ username });

    if (!videoExists || videoExists.status !== "ready") throw new ApiError(400, "Video not found");
    const video = await Video.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(videoId),
            },
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "video",
                as: "likes",
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $lookup: {
                            from: "subscriptions",
                            localField: "_id",
                            foreignField: "channel",
                            as: "subscribers",
                        },
                    },
                    {
                        $addFields: {
                            subscribersCount: {
                                $size: "$subscribers",
                            },
                            isSubscribed: {
                                $in: [userExists?._id, "$subscribers.subscriber"],
                            },
                        },
                    },
                    {
                        $project: {
                            username: 1,
                            fullName: 1,
                            avatar: 1,
                            subscribersCount: 1,
                            isSubscribed: 1,
                        },
                    },
                ],
            },
        },
        {
            $addFields: {
                likesCount: {
                    $size: "$likes",
                },
                owner: {
                    $first: "$owner",
                },
                isLiked: {
                    $in: [userExists?._id, "$likes.likedBy"],
                }
            },
        },
        {
            $project: {
                videoFile: 1,
                thumbnail: 1,
                title: 1,
                description: 1,
                views: 1,
                createdAt: 1,
                duration: 1,
                comments: 1,
                owner: 1,
                likesCount: 1,
                isLiked: 1,
                isSubscribed: 1,
                subscribersCount: 1,
                isPublished: 1,
            },
        },
    ]);

    if (!video.length) throw new ApiError(404, "Failed to get video");


    return res.status(200)
        .json(new ApiResponse(200, {
            video: video[0]
        }, "Video fetched successfully"))
})



const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { title, description } = req.body;
    const video = await Video.findById(videoId);
    if (!video) throw new ApiError(400, "Video not found");

    const thumbnailLocalPath = req.file?.path;

    if (!(title || description || thumbnailLocalPath)) {
        throw new ApiError(400, "Atleast one field is required to update");
    }

    let newThumbnail;
    if (thumbnailLocalPath) {
        await deleteFileFromImageKit(video.thumbnail, 'curatube-thumbnails');
        newThumbnail = await uploadOnImageKit(thumbnailLocalPath, 'curatube-thumbnails');
    }

    let updateOptions = {
        title,
        description,
    }

    if (thumbnailLocalPath) updateOptions.thumbnail = newThumbnail.url;

    const updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: updateOptions
        },
        {
            new: true
        }
    )

    if (!updatedVideo) {
        throw new Error(400, "Failed to update video details");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updatedVideo, "Video Details Updated Successfully"));



})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const video = await Video.findById(videoId);

    if (!video || video.status !== "ready") throw new ApiError(404, "Video not found");



    const assetPublicIds = video.asset_public_ids || [];
    console.log('📂 Assets to delete:', assetPublicIds);

    await Promise.all([
        Like.deleteMany({ video: videoId }),
        Comment.deleteMany({ video: videoId }),
        ...assetPublicIds.map(async (asset) => {
            await deleteFileFromCloudinary(asset.public_id, asset.resource_type);
        })
    ]);

    await Video.findByIdAndDelete(videoId);

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Video Deleted Successfully"));
});


const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    const videoExists = await Video.findById(videoId);

    if (!videoExists || videoExists.status !== "ready") {
        throw new ApiError(400, "Video not found");
    }

    if (videoExists.owner.toString() !== req.user._id.toString()) throw new ApiError(400, "Not your video")

    const toggleStatus = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: {
                isPublished: !(videoExists.isPublished),
            }
        },
        {
            new: true
        }
    )

    if (!toggleStatus) {
        throw new ApiError(400, "Failed to toggle publish status");
    }

    return res
        .status(200)
        .json(new ApiResponse(200,
            {
                isPublished: toggleStatus.isPublished,
                videoId: toggleStatus._id
            },
            toggleStatus.isPublished ? "Video Published Successfully" : "Video Unpublished Successfully"));
})

const updateVideoViews = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id");
    }
    const videoExists = await Video.findById(videoId);

    if (!videoExists || videoExists.status !== "ready") throw new ApiError(400, "Video not found");

    const user = await User.findById(req.user._id);

    const alreadyWatched = user.watchHistory.find(
        (history) => history.video.toString() === videoId
    )

    if (alreadyWatched) {
        alreadyWatched.watchedAt = new Date();
    } else {
        user.watchHistory.push({
            video: videoId,
            watchedAt: new Date()
        })
    }
    await user.save();

    const updatedVideo = await Video.findByIdAndUpdate(videoId, {
        $inc: {
            views: 1
        }
    }, {
        new: true
    })

    if (!updatedVideo) throw new ApiError(400, "Failed to update views");

    return res
        .status(200)
        .json(new ApiResponse(200, {
            video: updatedVideo,
            user
        }
            , "Views updated Successfully"))
})

export {
    getAllVideos,
    publishAVideo,
    getVideoUploadStatus,
    getVideoById,
    updateVideo,
    deleteVideo,
    updateVideoViews,
    togglePublishStatus
}