import type { Video } from "./video.types";

interface PlaylistVideo{
    video: Video;
    addedAt: string;
}

export interface Playlist {
    _id: string;
    name: string;
    description: string;
    lastVideoThumbnail?: string;
    createdAt: string;
    updatedAt: string;
    videos: PlaylistVideo[];
}