import type { CommentFetchParams } from "@/types/comments.types";
import { apiClient, type ApiSuccessResponse } from "./api-client";




export const getVideoComments = async (videoId: string,params:CommentFetchParams): Promise<any> => {
    try {
        const res = await apiClient.get<ApiSuccessResponse>(`/comments/${videoId}`, { params });
        return res.data;
    } catch (error) {
        console.error("Error during fetching video comments:", error);
        throw error;
    }
}

export const addComment = async (videoId: string, content: string): Promise<any> => {
    try {
        const res = await apiClient.post<ApiSuccessResponse>(`/comments/${videoId}`, { content });
        return res.data;
    } catch (error) {
        console.error("Error during adding comment:", error);
        throw error;
    }
}


export const updateComment = async (commentId: string, content: string): Promise<any> => {
    try {
        const res = await apiClient.patch<ApiSuccessResponse>(`/comments/c/${commentId}`, { content });
        return res.data;
    } catch (error) {
        console.error("Error during updating comment:", error);
        throw error;
    }
}

export const deleteComment = async (commentId: string): Promise<any> => {
    try {
        const res = await apiClient.delete<ApiSuccessResponse>(`/comments/c/${commentId}`);
        return res.data;
    } catch (error) {
        console.error("Error during deleting comment:", error);
        throw error;
    }
}