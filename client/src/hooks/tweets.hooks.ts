import { createTweet, getAllTweets } from "@/api/tweets.api"
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
        mutationFn: (content:string) => createTweet(content),
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