
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
        const res = await apiClient.get<ApiSuccessResponse>(`/users/channel/${username}`, {
            params: {
                subscriberId: subscriberId
            }
        })
        return res.data
    } catch (error) {
        console.error("Error during fetching user channel profile:", error);
        throw error;
    }
}


export const updateUserProfileImage = async (formData: FormData): Promise<any> => {
    try {
        const res = await apiClient.patch<ApiSuccessResponse>('/users/avatar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        return res.data
    } catch (error) {
        console.error("Error during updating user profile image:", error);
        throw error;
    }
}

export const updateUserCoverImage = async (formData: FormData): Promise<any> => {
    try {
        const res = await apiClient.patch<ApiSuccessResponse>('/users/cover-image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        return res.data
    } catch (error) {
        console.error("Error during updating user cover image:", error);
        throw error;
    }
}