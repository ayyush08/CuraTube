import { getVideoDuration, rewriteM3U8Playlist, transcodeToHLS } from "../../utils/videoUtils.js";
import { inngest } from "../client.js";
import path from "path";
import fs from 'fs-extra';
import { deleteFileFromCloudinary, uploadToCloudinary } from "../../utils/cloudinary.js";
import { Video } from "../../models/video.model.js";

export const processUploadedVideo = inngest.createFunction(
    { id: "process-video-upload" ,retries:2},
    { event: "video/publish" },
    async ({ event }) => {
        const { videoId, title, now, videoLocalPath, thumbnailLocalPath } = event.data;

        const hlsOutputDir = path.join("./public/temp", `hls-${now}`);
        const absoluteVideoPath = path.resolve(videoLocalPath);
        const segmentUrlMap = {};
        const assetPublicIds = [];

        try {
            await fs.ensureDir(hlsOutputDir);

            const videoDuration = await getVideoDuration(absoluteVideoPath);
            await transcodeToHLS(absoluteVideoPath, hlsOutputDir);

            const hlsFiles = await fs.readdir(hlsOutputDir);

            // Upload TS segments (skip .m3u8 for now)
            for (const file of hlsFiles) {
                if (file.endsWith(".m3u8")) continue;

                const localPath = path.join(hlsOutputDir, file);
                const result = await uploadToCloudinary(
                    localPath,
                    `curatube-videos/${title}-${now}`,
                    file,
                    "video"
                );

                segmentUrlMap[file] = result.secure_url;
                assetPublicIds.push({
                    public_id: result.public_id,
                    resource_type: result.resource_type,
                });
            }

            // Upload playlist after rewriting URLs
            const playlistFile = hlsFiles.find((f) => f.endsWith(".m3u8"));
            const playlistPath = path.join(hlsOutputDir, playlistFile);
            await rewriteM3U8Playlist(playlistPath, segmentUrlMap);

            const playlistResult = await uploadToCloudinary(
                playlistPath,
                `curatube-videos/${title}-${now}`,
                playlistFile,
                "raw"
            );
            assetPublicIds.push({
                public_id: playlistResult.public_id,
                resource_type: playlistResult.resource_type,
            });

            // Upload thumbnail
            const thumbnailResult = await uploadToCloudinary(
                thumbnailLocalPath,
                `curatube-thumbnails/${title}-${now}`,
                path.basename(thumbnailLocalPath),
                "image"
            );
            assetPublicIds.push({
                public_id: thumbnailResult.public_id,
                resource_type: thumbnailResult.resource_type,
            });

            // Final DB update
            await Video.findByIdAndUpdate(videoId, {
                videoFile: playlistResult.secure_url,
                thumbnail: thumbnailResult.secure_url,
                duration: Math.round(videoDuration),
                asset_public_ids: assetPublicIds,
                status: "ready",
            });

        } catch (error) {
            console.error("❌ Error processing video:", error);


            await Video.findByIdAndUpdate(videoId, { status: "failed" });


            for (const { public_id, resource_type } of assetPublicIds) {
                try {
                    await deleteFileFromCloudinary(public_id, resource_type);
                } catch (err) {
                    console.warn(`Could not delete asset ${public_id} from Cloudinary`, err);
                }
            }
        } finally {

            try {
                await fs.remove(hlsOutputDir);
                await fs.remove(videoLocalPath);
                await fs.remove(thumbnailLocalPath);
            } catch (err) {
                console.warn("Failed to clean up temp files", err);
            }
        }
    }
);
