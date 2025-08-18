
import axios from "axios";
import { apiClient, type ApiSuccessResponse } from "./api-client";
import type { VideoFetchParams } from "@/types/video.types";


export const getAllVideos = async (params: VideoFetchParams): Promise<any> => {
    try {
        const res = await apiClient.get<ApiSuccessResponse>('/videos', { params })
        return res.data
    } catch (error) {
        console.error("Error during fetching all videos:", error);
        throw error;
    }
}

export const getVideoById = async (videoId: string, username: string): Promise<any> => {
    try {
        const res = await apiClient.get<ApiSuccessResponse>(`/videos/${videoId}`, {
            params: { username }
        })
        return res.data
    } catch (error) {
        console.error("Error during fetching video by ID:", error);
        throw error;
    }
}

export const updateVideoViews = async (videoId: string): Promise<any> => {
    try {
        const res = await apiClient.patch<ApiSuccessResponse>(`/videos/views/${videoId}`);
        return res.data;
    } catch (error) {
        console.error("Error during updating video views:", error);
        throw error;

    }
}


interface SignedRes {
    folder: string,
    timestamp: string,
    signature: string,
    apiKey: string,
    cloudName: string,
}

export const publishVideo = async (formData: FormData): Promise<any> => {
    try {
        const sres = await apiClient.get<ApiSuccessResponse>('/videos/get-signed-url');
        // console.log("Signed URL response", sres.data);

        const signedRes: SignedRes = sres.data;
        if (!signedRes.apiKey || !signedRes.signature) {
            throw new Error("Failed to get signed URL for video upload");
        }
        const cloudinary_params = {
            api_key: signedRes.apiKey,
            signature: signedRes.signature,
            timestamp: signedRes.timestamp,
            file: formData.get('videoFile'),
            folder: signedRes.folder,
        };

        const cloudinary_endpoint = `https://api.cloudinary.com/v1_1/${signedRes.cloudName}/auto/upload`;

        const uploadRes = await axios.post(cloudinary_endpoint, cloudinary_params, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });

        const uploadResult = uploadRes.data;
        // console.log("Upload result:", uploadResult);

        const formDataToSend = new FormData();
        formDataToSend.append("title", String(formData.get("title") ?? ""));
        formDataToSend.append("thumbnail", formData.get("thumbnail") as File);
        formDataToSend.append("isPublished", String(formData.get("isPublished") ?? "false"));
        formDataToSend.append("description", String(formData.get("description") ?? ""));
        formDataToSend.append("videoUrl", uploadResult.secure_url);
        formDataToSend.append("duration", Math.round(uploadResult.duration).toString());
        const res = await apiClient.post<ApiSuccessResponse>('/videos', formDataToSend);
        return res.data;
    } catch (error) {
        console.error("Error during publishing video:", error);
        throw error;
    }
}

export const getVideoUploadStatus = async (videoId: string): Promise<any> => {
    try {
        const res = await apiClient.get<ApiSuccessResponse>(`/videos/status/${videoId}`);
        return res.data;
    } catch (error) {
        console.error("Error during fetching video upload status:", error);
        throw error;
    }
}

export const togglePublishStatus = async (videoId: string): Promise<any> => {
    try {
        const res = await apiClient.patch<ApiSuccessResponse>(`/videos/toggle/publish/${videoId}`);
        return res.data;
    } catch (error) {
        console.error("Error during toggling publish status:", error);
        throw error;
    }
}

export const deleteVideo = async (videoId: string): Promise<any> => {
    try {
        const res = await apiClient.delete<ApiSuccessResponse>(`/videos/${videoId}`);
        return res.data;
    } catch (error) {
        console.error("Error during deleting video:", error);
        throw error;
    }
}