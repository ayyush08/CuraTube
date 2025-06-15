import { getAllVideosForHome } from "@/api/videos.api";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";


export const useGetVideosForHome = () => {
    return useQuery({
        queryKey: ['videos', 'home'],
        queryFn: async () => {
            try {
                const res = await getAllVideosForHome();
                
                
                return res.videos;
            } catch (error) {
                toast.error("Something went wrong while fetching videos");
                console.error("Error fetching videos:", error);
            }
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
    })
}