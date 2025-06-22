
import { apiClient, type ApiSuccessResponse } from "./api-client";
import type { VideoFetchParams } from "@/types/video.types";


export const getAllVideos = async (params: VideoFetchParams): Promise<any> => {
    try {
        const res = await apiClient.get<ApiSuccessResponse>('/videos', { params })
        return res.data
    } catch (error) {
        console.error("Error during fetching all videos:", error);
        throw error;
    }
}

export const getVideoById = async (videoId: string, username: string): Promise<any> => {
    try {
        const res = await apiClient.get<ApiSuccessResponse>(`/videos/${videoId}`, {
            params: { username }
        })
        return res.data
    } catch (error) {
        console.error("Error during fetching video by ID:", error);
        throw error;
    }
}

export const updateVideoViews = async(videoId:string) : Promise<any> =>{
    try {
        const res = await apiClient.patch<ApiSuccessResponse>(`/videos/views/${videoId}`);
        return res.data;
    } catch (error) {
        console.error("Error during updating video views:", error);
        throw error;
        
    }
}