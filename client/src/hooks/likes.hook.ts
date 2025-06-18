import { getLikedVideos, toggleVideoLike } from "@/api/likes.api"
import { useMutation, useQuery } from "@tanstack/react-query"
import { toast } from "sonner"


export const useGetLikedVideos = () => {
    return useQuery({
        queryKey: ['liked-videos'],
        queryFn: () => getLikedVideos(),
        staleTime: 1000 * 60 * 5,
    })
}

export const useToggleVideoLike = (setIsVideoLiked: React.Dispatch<React.SetStateAction<any>>, setLikeCount: React.Dispatch<React.SetStateAction<any>>) => {
    return useMutation({
        mutationFn: async (videoId: string) => {
            try {
                const res = await toggleVideoLike(videoId)
                return res;
            } catch (error: any) {
                toast.error(error);
                throw new Error(error);
            }
        },
        onSuccess: (data) => {
            setIsVideoLiked(data?.liked)
            setLikeCount(data?.likeCount)
            if (data?.liked) toast.success("Video Liked successfully")
            else toast.success("Video Unliked successfully")
        },
        onError: (error) => {
            console.error("Mutation error:", error);
        },
    })
}