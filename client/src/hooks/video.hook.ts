import { getAllVideos, getVideoById } from "@/api/videos.api";
import type { VideoFetchParams } from "@/types/video.types";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

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
    return useQuery({
        queryKey: ['video', videoId],
        queryFn: () => getVideoById(videoId),
        staleTime: 1000 * 60 * 5,
        enabled: !!videoId, // Only run if videoId is provided
    });
}

