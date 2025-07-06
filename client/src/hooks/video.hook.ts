import { getAllVideos, getVideoById, publishVideo, updateVideoViews } from "@/api/videos.api";
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


export const usePublishVideo = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate()
    return useMutation({
        mutationFn: (formData: FormData) => publishVideo(formData),
        onSuccess: (data) => {
            toast.success("Video published successfully");
            console.log("Video published successfully",data);
            queryClient.invalidateQueries({ queryKey: ['videos'] });
            queryClient.invalidateQueries({ queryKey: ['videos-infinite'] });
            navigate({
                to: `/videos/${data.video._id}`,
            })
        },
        onError: (error) => {
            console.error("Error publishing video", error);
        },
    })
}