
import { apiClient, type ApiSuccessResponse } from "./api-client";

export const getUserWatchHistory = async (): Promise<any> => {
    try {
        const res = await apiClient.get<ApiSuccessResponse>('/users/watch-history')
        return res.data
    } catch (error) {
        console.error("Error during fetching user watch history:", error);
        throw error;
    }
}


export const getUserChannelProfile = async (username: string, subscriberId: string): Promise<any> => {
    try {
        const res = await apiClient.get<ApiSuccessResponse>(`/users/channel/${username}`,{
            params:{
                subscriberId: subscriberId
            }
        })
        return res.data
    } catch (error) {
        console.error("Error during fetching user channel profile:", error);
        throw error;
    }
}