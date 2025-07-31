import { addComment, deleteComment, getVideoComments, updateComment } from "@/api/comments.api";
import type { CommentFetchParams } from "@/types/comments.types";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";


export const useGetVideoComments = (videoId: string, {
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
}: CommentFetchParams) => {
    return useInfiniteQuery({
        queryKey: ['video-comments', { page, limit, sortBy }],
        queryFn: async ({ pageParam = 1 }) => {
            const response = await getVideoComments(videoId, {
                page: pageParam,
                limit,
                sortBy
            });
            return response;
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            const hasMore = lastPage.length === limit;
            return hasMore ? allPages.length + 1 : undefined;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    })
}

export const useAddComment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ videoId, content }: { videoId: string; content: string }) => addComment(videoId, content),
        onSuccess: (data) => {
            console.log("Comment added successfully", data);
            toast.success("Comment added successfully");
            queryClient.invalidateQueries({ queryKey: ['video-comments'] });
        },
        onError: (error) => {
            console.error("Error adding comment:", error);
        },
    })
}



export const useUpdateComment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ commentId, content }: { commentId: string; content: string }) => updateComment(commentId, content),
        onSuccess: (data) => {
            console.log("Comment updated successfully", data);
            toast.success("Comment updated successfully");
            queryClient.invalidateQueries({ queryKey: ['video-comments'] });
        },
        onError: (error) => {
            console.error("Error updating comment:", error);
        },
    })
}

export const useDeleteComment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (commentId: string) => deleteComment(commentId),
        onSuccess: (data) => {
            console.log("Comment deleted successfully", data);
            queryClient.invalidateQueries({ queryKey: ['video-comments'] });
        },
        onError: (error) => {
            console.error("Error deleting comment:", error);
        },
    })
}
