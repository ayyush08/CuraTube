import { getAllTweets } from "@/api/tweets.api"
import type { TweetFetchParams } from "@/types/tweets.types"
import { useQuery } from "@tanstack/react-query"


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
