import { getChannelStats, getRecentVideos } from "@/api/dashboard.api"
import { useQuery } from "@tanstack/react-query"


export const useGetChannelStats = ()=>{
    return useQuery({
        queryKey: ['channel-stats'],
        queryFn: ()=>getChannelStats(),
        staleTime: 1000 * 60 * 5
    })
}

export const useGetRecentVideos = ()=>{
    return useQuery({
        queryKey: ['recent-videos'],
        queryFn: ()=>getRecentVideos(),
        staleTime: 1000 * 60 * 5
    })
}