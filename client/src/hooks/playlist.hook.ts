import { addVideoToPlaylist, createPlaylist, getUserPlaylists } from "@/api/playlist.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCreatePlaylist = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (data: { name: string; description: string, videoId: string }) => {
            try {
                const response = await createPlaylist(data.name, data.description)
                console.log("Playlist created:", response);
                
                const addVideo = await addVideoToPlaylist(response._id, data.videoId);
                console.log("Video added to playlist:", addVideo);
            } catch (error) {
                console.error("Error creating playlist:", error)
                toast.error("Failed to create playlist.")
            }
        },
        onSuccess: (data) => {
            console.log("Playlist created successfully", data);
            toast.success("Playlist created successfully");
            queryClient.invalidateQueries({ queryKey: ['playlists'] })
        },
        onError: (error) => {
            console.error("Error creating playlist:", error);
        },
    })
}


export const useGetUserPlaylists = (userId: string) => {
    return useQuery({
        queryKey: ['playlists'],
        queryFn: () => getUserPlaylists(userId),
        staleTime: 1000 * 60 * 5, 
        enabled: !!userId, 
    })
}

export const useAddVideoToPlaylist = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: { playlistId: string; videoId: string }) => addVideoToPlaylist(data.playlistId, data.videoId),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['playlists'] })
            console.log("Video added to playlist successfully", data);
            toast.success("Video added to playlist successfully");
        },
        onError: (error) => {
            console.error("Error adding video to playlist:", error);
            toast.error(error?.message);
        },
    })
}