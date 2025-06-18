import { getUserChannelProfile, getUserWatchHistory } from "@/api/user.api"
import type { UserChannelProfile } from "@/types/user.type"
import { useQuery } from "@tanstack/react-query"

export const useWatchHistory = () => {
    return useQuery({
        queryKey: ['watch-history'],
        queryFn: () => getUserWatchHistory(),
        staleTime: 1000 * 60 * 5,
    })
}

export const useUserChannelProfile = (username: string, subscriberId: string) => {
    return useQuery<UserChannelProfile>({
        queryKey: ['user-channel-profile', username, subscriberId],
        queryFn: () => getUserChannelProfile(username, subscriberId),
        staleTime: 1000 * 60 * 5,
        enabled: !!username, // Only run the query if username is provided
    })
}