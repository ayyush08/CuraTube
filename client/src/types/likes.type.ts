import type { Video } from "./video.types"


export interface LikedVideo {
    _id: string;
    video: string;
    likedBy: string;
    createdAt: string;
    updatedAt: string;
    videoDetails: Video;
}