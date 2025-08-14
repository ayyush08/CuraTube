import { deleteVideo, getAllVideos, getVideoById, getVideoUploadStatus, publishVideo, togglePublishStatus, updateVideoViews } from "@/api/videos.api";
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
            console.log(res);

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
    return useMutation({
        mutationFn: () => updateVideoViews(videoId),
        onSuccess: () => {
            console.log("Views updated");
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
            setIsUploading(true)
            console.log("Video published successfully", data);
            
            const videoId = data?.videoId;
            console.log("Video uploaded. Starting polling...", videoId);

            const interval = setInterval(async () => {
                try {
                    const res = await getVideoUploadStatus(videoId);
                    console.log("Polling response:", res);
                    
                    const status = res.status;

                    // You can also check for specific fields like:
                    // if (video.streamUrl && video.thumbnail)
                    if (status === "ready") {
                        setIsUploading(false);
                        console.log("Video is ready", res);
                        clearInterval(interval);

                        toast.success("Video processed!");
                        queryClient.invalidateQueries({ queryKey: ['videos'] });
                        queryClient.invalidateQueries({ queryKey: ['videos-infinite'] });
                        navigate({
                            to: `/videos/${videoId}`,
                        });
                    }else if(status === "processing") {
                        console.log("Video is still processing", res);
                    }
                    else{
                        toast.error("Video processing failed");
                        setIsUploading(false);
                        
                    }
                } catch (err) {
                    console.error("Polling error", err);
                }
            }, 3000); 
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
        },
        onError: (error) => {
            console.error("Error toggling publish status", error);
        },
    })
}

export const useDeleteVideo = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (videoId: string) => deleteVideo(videoId),
        onSuccess: () => {
            toast.success("Video deleted successfully");
            queryClient.invalidateQueries({ queryKey: ['videos'] });
            queryClient.invalidateQueries({ queryKey: ['videos-infinite'] });
        },
        onError: (error) => {
            console.error("Error deleting video", error);
        },
    })
}
