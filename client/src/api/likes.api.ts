
import { apiClient, type ApiSuccessResponse } from "./api-client";



export const getLikedVideos = async (): Promise<any> => {
    try {
        const res = await apiClient.get<ApiSuccessResponse>(`/likes/videos`);
        return res.data
    } catch (error) {
        console.error("Error during fetching liked videos:", error);
        throw error;
    }
}

export const toggleVideoLike = async (videoId: string): Promise<any> => {
    try {
        const res = await apiClient.post<ApiSuccessResponse>(`/likes/toggle/v/${videoId}`)
        console.log("tv",res);
        
        return res.data
    } catch (error) {
        console.error("Error toggling like", error)
        throw error
    }
}
export const toggleCommentLike = async (commentId: string): Promise<any> => {
    try {
        const res = await apiClient.post<ApiSuccessResponse>(`/likes/toggle/c/${commentId}`)
        return res.data
    } catch (error) {
        console.error("Error toggling comment", error)
        throw error
    }
}
export const toggleTweetLike = async (tweetId: string): Promise<any> => {
    try {
        const res = await apiClient.post<ApiSuccessResponse>(`/likes/toggle/t/${tweetId}`)
        return res.data
    } catch (error) {
        console.error("Error toggline like", error)
        throw error
    }
}