import { deleteVideo, getAllVideos, getVideoById, publishVideo, togglePublishStatus, updateVideoViews } from "@/api/videos.api";
import { useAppSelector } from "@/redux/hooks";
import type { VideoFetchParams } from "@/types/video.types";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

export const usePaginatedVideos = ({
    query = '',
    sortBy = 'createdAt',
    sortType = 'desc',
    userId = '',
    page = 1,
    limit = 10
}: VideoFetchParams) => {
    return useQuery({
        queryKey: ['videos', { query, sortBy, sortType, userId, page, limit }],
        queryFn: () => getAllVideos({ query, sortBy, sortType, userId, page, limit }),

        staleTime: 1000 * 60 * 5,
    })
}

export const useInfiniteVideos = ({
    query = '',
    sortBy = 'createdAt',
    sortType = 'desc',
    userId = '',
    limit = 10
}: VideoFetchParams) => {
    return useInfiniteQuery({
        queryKey: ['videos-infinite', { query, sortBy, sortType, userId }],
        queryFn: async ({ pageParam = 1 }) => {
            const res = await getAllVideos({ query, sortBy, sortType, userId, page: pageParam, limit });
            

            return res;
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            const hasMore = lastPage.videos.length === limit;
            return hasMore ? allPages.length + 1 : undefined;
        },
        staleTime: 1000 * 60 * 5,
    })
}

export const useVideoById = ({ videoId }: { videoId: string }) => {
    const user = useAppSelector(state => state.auth.user?.username);
    return useQuery({
        queryKey: ['video', videoId],
        queryFn: () => getVideoById(videoId, user ? user : ''),
        staleTime: 1000 * 60 * 5,
        enabled: !!videoId, // Only run if videoId is provided
    });
}

export const useUpdateViews = ({ videoId }: { videoId: string }) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => updateVideoViews(videoId),
        onSuccess: () => {
            console.log("Views updated");
            queryClient.invalidateQueries({ queryKey: ['video', videoId] });
        },
        onError: (error) => {
            console.error("Error updating views", error);
        },

    })
}


export const usePublishVideo = (setIsUploading: React.Dispatch<React.SetStateAction<boolean>>) => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: (formData: FormData) => publishVideo(formData),
        onSuccess: (data) => {
            const videoId = data?.videoId;
            setIsUploading(false);
            toast.success("Video uploaded successfully");
            queryClient.invalidateQueries({ queryKey: ['videos'] });
            queryClient.invalidateQueries({ queryKey: ['videos-infinite'] });
            queryClient.invalidateQueries({ queryKey: ['recent-videos'] });
            navigate({
                to: `/videos/${videoId}`,
            });
            console.log("Video published successfully");



        },
        onError: (error) => {
            console.error("Error publishing video", error);
            toast.error("Failed to publish video");
        },
    });
}



export const useTogglePublishStatus = (setIsPublished: React.Dispatch<React.SetStateAction<boolean | undefined>>) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (videoId: string) => {
            return togglePublishStatus(videoId);
        },
        onSuccess: (data) => {
            setIsPublished(data?.isPublished);
            if (data?.isPublished) toast.success("Video published successfully");
            else toast.success("Video unpublished successfully");
            console.log("Video publish status toggled successfully", data);
            queryClient.invalidateQueries({ queryKey: ['video', data?.videoId] });
            queryClient.invalidateQueries({ queryKey: ['videos'] });
            queryClient.invalidateQueries({ queryKey: ['videos-infinite'] });
            queryClient.invalidateQueries({ queryKey: ['recent-videos'] });
        },
        onError: (error) => {
            console.error("Error toggling publish status", error);
        },
    })
}

export const useDeleteVideo = (onClose: () => void) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (videoId: string) => deleteVideo(videoId),
        onSuccess: () => {
            toast.success("Video deleted successfully");
            queryClient.invalidateQueries({ queryKey: ['videos'] });
            queryClient.invalidateQueries({ queryKey: ['videos-infinite'] });
            queryClient.invalidateQueries({ queryKey: ['recent-videos'] });
            onClose?.();
            window.history.back();
        },
        onError: (error) => {
            console.error("Error deleting video", error);
        },
    })
}
