"use client"





import type { Video } from "@/types/video.types"

import VideoTile from "../video/VideoTile"
import VideoTileLoader from "../loaders/VideoTileLoader"

interface RecentVideosProps {
    videos: Video[],
    loading: boolean
}


export function RecentVideos({ videos, loading }: RecentVideosProps) {


    if (loading) {
        return (
            <VideoTileLoader/>
        )
    }

    return (
        <>
            {
                videos.length > 0 ? (
                    videos.map((video)=>(
                        <VideoTile video={video} key={video._id} />
                    ))
                ) : (
                    <p>No videos found</p>
                )
            }
        </>
    )
}
