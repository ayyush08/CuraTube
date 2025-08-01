import type { Video } from "./video.types";

export interface PlaylistVideo{
    video: Video;
    addedAt: string;
}

export interface Playlist {
    _id: string;
    name: string;
    description: string;
    owner:string;
    latestVideoThumbnail?: string;
    createdAt: string;
    updatedAt: string;
    videos: PlaylistVideo[];
}