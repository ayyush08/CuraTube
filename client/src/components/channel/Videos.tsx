
import { useEffect, useRef } from "react";
import VideoCard from "../video/VideoCard";
import type { Video } from "@/types/video.types";
import { Loader2Icon } from "lucide-react";
import { useInfiniteVideos } from "@/hooks/video.hook";

export const Videos = ({ userId }: { userId: string | undefined }) => {
    const { data, fetchNextPage, hasNextPage, isPending: isLoadingVideos, isFetchingNextPage } = useInfiniteVideos({
        userId: userId,
        page: 1,
        limit: 10,
        sortBy: 'createdAt',
        sortType: 'desc',
    });

    const videos = data?.pages.flatMap((page) => page.videos) || [];

    console.log("Videos data:", videos);

    const loaderRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        console.log("Videos component mounted");
    }, []);

    

    useEffect(() => {
        const currentLoader = loaderRef.current;
        if (loaderRef.current) {
            console.log("LoaderRef found:", loaderRef.current.getBoundingClientRect());
        }
        if (!currentLoader) return;
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage) {
                    console.log("Fetching more videos...");
                    fetchNextPage();
                }
            },
        );

        if (currentLoader) {
            observer.observe(currentLoader);
        }

        return () => {
            if (currentLoader) {
                observer.unobserve(currentLoader);
            }
        };
    }, [hasNextPage, fetchNextPage]);

    if (isLoadingVideos) return <div>Loading videos...</div>

    if (videos.length === 0) {
        return <div className="text-center text-xl p-4 font-semibold font-mono text-orange-400 w-full">No videos found. <br />  Might wanna click that upload video button?</div>;
    }
    return (
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2  md:grid-cols-3 lg:grid-cols-4 gap-5" >
            {

                videos.map((video: Video) => (
                    <VideoCard key={video._id} video={video} />
                ))

            }

            {
                hasNextPage && (
                    <div
                        ref={loaderRef}
                        className="col-span-full border-2  border-red-300 text-white text-sm text-center py-4"
                    >
                        {isFetchingNextPage ?
                            <Loader2Icon className='animate-spin w-4 h-4 inline-block' /> : 'Scroll to load more'}
                    </div>
                )
            }
        </div>
    )
}