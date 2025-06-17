import type { ApiSuccessResponse } from "@/types/auth.types";
import { apiClient } from "./api-client";



export const getLikedVideos = async (): Promise<any> => {
    try {
        const res = await apiClient.get<ApiSuccessResponse>(`/likes/videos`);
        return res.data
    } catch (error) {
        console.error("Error during fetching liked videos:", error);
        throw error;
    }
}
