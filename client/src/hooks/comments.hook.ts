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
        queryKey: ['video-comments', videoId, { page, limit, sortBy }],
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
            toast.success("Comment added successfully");
            console.log("Comment added successfully", data);
            queryClient.invalidateQueries({ queryKey: ['video-comments',data?.video] });
        },
        onError: (error) => {
            console.error("Error adding comment:", error);
            toast.error(error?.message || "Failed to add comment.");

        },
    })
}



export const useUpdateComment = (
    setEditText: React.Dispatch<React.SetStateAction<string>>,
    setEditingCommentId: React.Dispatch<React.SetStateAction<string | null>>
) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ commentId, content }: { commentId: string; content: string }) => updateComment(commentId, content),
        onSuccess: (data) => {
            console.log("Comment updated successfully", data);
            toast.success("Comment updated successfully");
            queryClient.invalidateQueries({ queryKey: ['video-comments',data?.video] });
            setEditingCommentId(null);
            setEditText("");
        },
        onError: (error) => {
            console.error("Error updating comment:", error);
        },
    })
}

export const useDeleteComment = (videoId: string,onClose? : () => void) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (commentId: string) => deleteComment(commentId),
        onSuccess: (data) => {
            toast.success("Comment deleted successfully");
            console.log("Comment deleted successfully", data);
            queryClient.invalidateQueries({ queryKey: ['video-comments', videoId] });
            onClose?.();
        },
        onError: (error) => {
            console.error("Error deleting comment:", error);
        },
    })
}
