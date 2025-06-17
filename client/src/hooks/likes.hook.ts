import { getLikedVideos } from "@/api/likes.api"
import { useQuery } from "@tanstack/react-query"


export const useGetLikedVideos = () => {
    return useQuery({
        queryKey: ['liked-videos'],
        queryFn: ()=> getLikedVideos(),
        staleTime: 1000 * 60 * 5, 
    })
}