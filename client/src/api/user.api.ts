import type { ApiSuccessResponse } from "@/types/auth.types";
import { apiClient } from "./api-client";

export const getUserWatchHistory = async (): Promise<any> => {
    try {
        const res = await apiClient.get<ApiSuccessResponse>('/users/watch-history')
        return res.data
    } catch (error) {
        console.error("Error during fetching user watch history:", error);
        throw error;
    }
}