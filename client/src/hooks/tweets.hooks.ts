import { createTweet, deleteTweet, getAllTweets, updateTweet } from "@/api/tweets.api"
import type { TweetFetchParams } from "@/types/tweets.types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"


export const useGetTweets = ({
    sortBy = 'createdAt',
    sortType = 'desc',
    userId = '',
    page = 1,
    limit = 10
}: TweetFetchParams) => {
    return useQuery({
        queryKey: ['tweets', { sortBy, sortType, userId, page, limit }],
        queryFn: () => getAllTweets({ sortBy, sortType, userId, page, limit }),

        staleTime: 1000 * 60 * 5,
    })
}


export const useCreateTweet = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (content: string) => createTweet(content),
        onSuccess: (data) => {
            console.log("Tweet created successfully", data);
            toast.success("Tweet created successfully");
            queryClient.invalidateQueries({ queryKey: ['tweets'] })
        },
        onError: (error) => {
            console.error("Error creating tweet:", error);
        },
    })
}


export const useUpdateTweet = (setTweetContent: React.Dispatch<React.SetStateAction<string>>, setIsEditing: React.Dispatch<React.SetStateAction<boolean>>) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ tweetId, content }: { tweetId: string, content: string }) => updateTweet(tweetId, content),
        onSuccess: (data) => {
            setTweetContent(data.content)
            setIsEditing(false);
            console.log("Tweet updated successfully", data);
            toast.success("Tweet updated successfully");
            queryClient.invalidateQueries({ queryKey: ['tweets'] })
        },
        onError: (error) => {
            console.error("Error updating tweet:", error);
        },
    })
}

export const useDeleteTweet = (tweetId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: () => deleteTweet(tweetId),
        onSuccess: () => {
            console.log("Tweet deleted successfully");
            toast.success("Tweet deleted successfully");
            queryClient.invalidateQueries({ queryKey: ['tweets'] })
        },
        onError: (error) => {
            console.error("Error deleting tweet:", error);
        },
    })
}