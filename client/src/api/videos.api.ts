
import axios from "axios";
import { apiClient, type ApiSuccessResponse } from "./api-client";
import type { VideoFetchParams } from "@/types/video.types";

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

if (!CLOUDINARY_CLOUD_NAME) {
    throw new Error("Missing Cloudinary cloud name");
}

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

export interface SingleSignedRes {
    folder: string;
    timestamp: string;
    signature: string;
    apiKey: string;
    cloudName: string;
}

export interface SignedRes {
    video: SingleSignedRes;
    thumbnail: SingleSignedRes;
}


export const publishVideo = async (formData: FormData): Promise<any> => {
    try {
        const title = formData.get("title") as string;
        // Get signed URLs for video and thumbnail 
        const sres = await apiClient.post<ApiSuccessResponse>(`/videos/get-signed-url`, { title });
        const signedRes: SignedRes = sres.data;

        if (!signedRes.video.apiKey || !signedRes.video.signature || !signedRes.thumbnail.apiKey || !signedRes.thumbnail.signature) {
            throw new Error("Failed to get signed URL for upload");
        }
        const signedVideo = signedRes.video;
        const signedThumbnail = signedRes.thumbnail;
        const videoFile = formData.get("videoFile") as File;
        const thumbnailFile = formData.get("thumbnail") as File;

        const cloudinary_endpoint = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`;

        // Upload video
        const videoFormData = new FormData();
        videoFormData.append("file", videoFile);
        videoFormData.append("folder", signedVideo.folder);
        videoFormData.append("api_key", signedVideo.apiKey);
        videoFormData.append("signature", signedVideo.signature);
        videoFormData.append("timestamp", signedVideo.timestamp);
        
        const videoUploadRes = await axios.post(cloudinary_endpoint, videoFormData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        // Upload thumbnail
        const thumbnailFormData = new FormData();
        thumbnailFormData.append("file", thumbnailFile);
        thumbnailFormData.append("folder", signedThumbnail.folder);
        thumbnailFormData.append("api_key", signedThumbnail.apiKey);
        thumbnailFormData.append("signature", signedThumbnail.signature);
        thumbnailFormData.append("timestamp", signedThumbnail.timestamp);

        const thumbnailUploadRes = await axios.post(cloudinary_endpoint, thumbnailFormData, {
            headers: { "Content-Type": "multipart/form-data" },
        });


        const backendFormData = new FormData();
        backendFormData.append("title", String(formData.get("title") ?? ""));
        backendFormData.append("description", String(formData.get("description") ?? ""));
        backendFormData.append("isPublished", String(formData.get("isPublished") ?? "false"));
        backendFormData.append("videoUrl", videoUploadRes.data.secure_url);
        backendFormData.append("duration", Math.round(videoUploadRes.data.duration).toString());
        backendFormData.append("thumbnailUrl", thumbnailUploadRes.data.secure_url);
        backendFormData.append("signedVideoPublicId", videoUploadRes.data.public_id);
        backendFormData.append("signedThumbnailPublicId", thumbnailUploadRes.data.public_id);
        const res = await apiClient.post<ApiSuccessResponse>("/videos", backendFormData);
        return res.data;

    } catch (error) {
        console.error("Error during publishing video:", error);
        throw error;
    }
};




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