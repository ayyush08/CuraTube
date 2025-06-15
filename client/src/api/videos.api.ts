import { type ApiSuccessResponse } from "@/types/auth.types";
import { apiClient } from "./api-client";
import type { VideoFetchParams } from "@/types/video.types";


export const getAllVideosForHome = async (params: VideoFetchParams): Promise<any> => {
    try {
        const res = await apiClient.get<ApiSuccessResponse>('/videos', { params })
        return res.data
    } catch (error) {
        console.error("Error during registration:", error);
        throw error;
    }
}