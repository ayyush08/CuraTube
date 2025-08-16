import { apiClient, type ApiSuccessResponse } from "./api-client";


export const getChannelStats = async (): Promise<any> => {
    try {
        const res = await apiClient.get<ApiSuccessResponse>(`/dashboard/stats`);
        return res.data;
    } catch (error) {
        console.error("Error during fetching channel stats:", error);
        throw error;
    }
}

export const getRecentVideos = async (): Promise<any> => {
    try {
        const res = await apiClient.get<ApiSuccessResponse>(`/dashboard/videos`);
        return res.data;
    } catch (error) {
        console.error("Error during fetching recent videos:", error);
        throw error;
    }
}