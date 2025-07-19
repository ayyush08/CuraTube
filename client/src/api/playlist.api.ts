import { apiClient, type ApiSuccessResponse } from "./api-client";

export const createPlaylist = async (name: string, description: string):Promise<any> => {
    try {
        const res = await apiClient.post<ApiSuccessResponse>('/playlists', {
            name,
            description
        })
        return res.data;
    } catch (error) {
        console.error("Error creating playlist:", error);
        throw error;
    }
}

export const getUserPlaylists = async (userId: string): Promise<any> => {
    try {
        const res = await apiClient.get<ApiSuccessResponse>(`/playlists/user/${userId}`);
        return res.data;
    } catch (error) {
        console.error("Error fetching user playlists:", error);
        throw error;
    }
}

export const getPlaylistById = async (playlistId: string): Promise<any> => {
    try {
        const res = await apiClient.get<ApiSuccessResponse>(`/playlists/${playlistId}`);
        return res.data;
    } catch (error) {
        console.error("Error fetching playlist by ID:", error);
        throw error;
    }
}


export const addVideoToPlaylist = async (playlistId: string, videoId: string): Promise<any> => {
    try {
        const res = await apiClient.patch<ApiSuccessResponse>(`/playlists/add/${videoId}/${playlistId}`);
        return res.data;
    } catch (error) {
        console.error("Error adding video to playlist:", error);
        throw error;
    }
}