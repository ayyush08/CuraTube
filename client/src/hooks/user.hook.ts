import { getUserWatchHistory } from "@/api/user.api"
import { useQuery } from "@tanstack/react-query"

export const useWatchHistory = () => {
    return useQuery({
        queryKey: ['watch-history'],
        queryFn: () => getUserWatchHistory(),
        staleTime: 1000 * 60 * 5,
    })
}