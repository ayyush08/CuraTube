import { addVideoToPlaylist, createPlaylist, deletePlaylist, getPlaylistById, getUserPlaylists, removeVideoFromPlaylist, updatePlaylist } from "@/api/playlist.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";


export const useCreatePlaylist = (onClose?: () => void) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (data: { name: string; description: string, videoId: string }) => {
            try {
                const response = await createPlaylist(data.name, data.description)
                console.log("Playlist created:", response);

                const addVideo = await addVideoToPlaylist(response._id, data.videoId);
                console.log("Video added to playlist:", addVideo);
                return response;
            } catch (error) {
                console.error("Error creating playlist:", error)
                toast.error("Failed to create playlist.")
            }
        },
        onSuccess: (data) => {
            console.log("Playlist created successfully", data);
            toast.success("Playlist created successfully");
            queryClient.invalidateQueries({ queryKey: ['playlists', data.owner] })
            onClose?.();
        },
        onError: (error) => {
            console.error("Error creating playlist:", error);
        },
    })
}


export const useGetUserPlaylists = (userId: string) => {
    return useQuery({
        queryKey: ['playlists', userId],
        queryFn: () => getUserPlaylists(userId),
        staleTime: 1000 * 60 * 5,
        enabled: !!userId,
    })
}

export const useAddVideoToPlaylist = (onClose?: () => void) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: { playlistId: string; videoId: string }) => addVideoToPlaylist(data.playlistId, data.videoId),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['playlists', data.owner] })
            console.log("Video added to playlist successfully", data);
            onClose?.();
        },
        onError: (error) => {
            console.error("Error adding video to playlist:", error);
            toast.error(error?.message);
        },
    })
}

export const useRemoveVideoFromPlaylist = (onClose?: () => void) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: { playlistId: string; videoId: string }) => {
            return removeVideoFromPlaylist(data.playlistId, data.videoId);
        },
        onSuccess: (data) => {
            toast.success("Video removed from playlist successfully");
            console.log("Video removed from playlist successfully", data);
            queryClient.invalidateQueries({ queryKey: ['playlists', data.owner] });
            queryClient.invalidateQueries({ queryKey: ['playlist', data._id] });
            onClose?.();
        },
        onError: (error) => {
            console.error("Error removing video from playlist:", error);
            toast.error(error?.message);
        },
    })
}


export const useGetPlaylistById = (playlistId: string) => {
    return useQuery({
        queryKey: ['playlist', playlistId],
        queryFn: () => getPlaylistById(playlistId),
        staleTime: 1000 * 60 * 5,
        enabled: !!playlistId,
    })
}


export const useUpdatePlaylist = (setIsEditing: React.Dispatch<React.SetStateAction<boolean>>) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (data: { playlistId: string; name: string; description: string }) => {
            try {
                const response = await updatePlaylist(data.playlistId, data.name, data.description);
                console.log("Playlist updated:", response);
                return response;
            } catch (error) {
                console.error("Error updating playlist:", error);
                throw error;
            }
        },
        onSuccess: (data) => {
            toast.success("Playlist updated successfully");
            console.log("Playlist updated successfully", data);
            queryClient.invalidateQueries({ queryKey: ['playlist', data._id] })
            queryClient.invalidateQueries({ queryKey: ['playlists', data.owner] });
            setIsEditing(false);
        },
        onError: (error) => {
            console.error("Error updating playlist:", error);
            toast.error(error?.message || "Failed to update playlist.");
            setIsEditing(false);
        },
    })
}

export const useDeletePlaylist = (onClose?: () => void) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (playlistId: string) => {
            try {
                const response = await deletePlaylist(playlistId);
                console.log("Playlist deleted:", response);
                return response;
            } catch (error) {
                console.error("Error deleting playlist:", error);
                throw error;
            }
        },
        onSuccess: (data) => {
            console.log("Playlist deleted successfully");
            toast.success("Playlist deleted successfully");
            queryClient.invalidateQueries({ queryKey: ['playlists', data.owner] })
            onClose?.();
            window.history.back();
        },
        onError: (error) => {
            console.error("Error deleting playlist:", error);
            toast.error(error?.message || "Failed to delete playlist.");
            onClose?.();
        },
    })
}