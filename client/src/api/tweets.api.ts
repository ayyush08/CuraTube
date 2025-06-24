import type { TweetFetchParams } from "@/types/tweets.types";
import { apiClient, type ApiSuccessResponse } from "./api-client"

export const createTweet = async (content: string): Promise<any> => {
    try {
        const res = await apiClient.post<ApiSuccessResponse>(`/tweets`, { content });
        return res.data
    } catch (error) {
        console.error("Error during creating tweet:", error);
        throw error;
    }
}

export const getUserTweets = async (userId: string): Promise<any> => {
    try {
        const res = await apiClient.get<ApiSuccessResponse>(`/tweets/user/${userId}`);
        return res.data
    } catch (error) {
        console.error("Error during fetching user tweets:", error);
        throw error;
    }
}

export const getAllTweets = async (params: TweetFetchParams): Promise<any> => {
    try {
        const res = await apiClient.get<ApiSuccessResponse>(`/tweets`, { params });
        return res.data
    } catch (error) {
        console.error("Error during fetching all tweets:", error);
        throw error;
    }
}

export const updateTweet = async (tweetId: string, content: string): Promise<any> => {
    try {
        const res = await apiClient.put<ApiSuccessResponse>(`/tweets/${tweetId}`, { content });
        return res.data
    } catch (error) {
        console.error("Error during updating tweet:", error);
        throw error;
    }
}


export const deleteTweet = async (tweetId: string): Promise<any> => {
    try {
        const res = await apiClient.delete<ApiSuccessResponse>(`/tweets/${tweetId}`);
        return res.data
    } catch (error) {
        console.error("Error during deleting tweet:", error);
        throw error;
    }
}