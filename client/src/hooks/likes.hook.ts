import { getLikedVideos, toggleCommentLike, toggleTweetLike, toggleVideoLike } from "@/api/likes.api"
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
        mutationFn: (videoId: string) => toggleVideoLike(videoId)
        ,
        onSuccess: (data) => {
            setIsVideoLiked(data?.liked)
            setLikeCount(data?.likeCount)
            if (data?.liked) toast.success("Video Liked successfully")
            else toast.success("Video Unliked successfully")
        },
        onError: () => {
            toast.error("Failed to toggle like on video");
        },
    })
}


export const useToggleTweetLike = (setIsTweetLiked: React.Dispatch<React.SetStateAction<any>>, setLikeCount: React.Dispatch<React.SetStateAction<any>>) => {
    return useMutation({
        mutationFn: (tweetId: string) => toggleTweetLike(tweetId),
        onSuccess: (data) => {
            console.log("Toggle Tweet Like Response:", data);
            
            setIsTweetLiked(data?.liked)
            setLikeCount(data?.likeCount)
            if (data?.liked) toast.success("Tweet Liked successfully")
            else toast.success("Tweet Unliked successfully")
        },
        onError: () => {
            toast.error("Failed to toggle like on tweet");
        },
    })
}

export const useToggleCommentLike = (setCommentLikeStates: React.Dispatch<React.SetStateAction<any>>) => {
    return useMutation({
        mutationFn: (commentId: string) => toggleCommentLike(commentId),
        onSuccess: (data) => {
            console.log("Toggle Comment Like Response:", data);
            if(data?.isLiked) toast.success("Comment Liked successfully")
            else toast.success("Comment Unliked successfully")
            setCommentLikeStates((prevState: any) => ({
                ...prevState,
                [data?.commentId]: {
                    isLiked: data?.liked,
                    likeCount: data?.likeCount,
                },
            }));
            if (data?.liked) toast.success("Comment Liked successfully")
            else toast.success("Comment Unliked successfully")
        },
        onError: () => {
            toast.error("Failed to toggle like on comment");
        },
    })
}