import { type ApiSuccessResponse } from "@/types/auth.types";
import { apiClient } from "./api-client";

export const getAllVideos = async (): Promise<any> => {
    try {
        const res = await apiClient.get<ApiSuccessResponse>('/videos/')
        return res.data
    } catch (error) {
        console.error("Error during registration:", error);
        throw error;
    }
}