
import VideoCard from '@/components/video/VideoCard';
import { useInfiniteVideos } from '@/hooks/video.hook';
import type { Video } from '@/types/video.types';

import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef } from 'react';

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {


  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage
  } = useInfiniteVideos({ query: '', sortBy: 'createdAt', sortType: 'desc', limit: 10, page: 1 })
  
  const videos = data?.pages[0].videos || []


  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!loaderRef.current || !hasNextPage || isFetchingNextPage) return;
    console.log("Fetchnext page", isFetchingNextPage, hasNextPage);

    const currentLoader = loaderRef.current;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fetchNextPage();
      }
    });

    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) observer.unobserve(currentLoader);
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);


  if(videos.length === 0 ) return <div className='flex justify-center items-center min-h-screen'>No videos found</div>
  if (isLoading) return <div className='flex justify-center items-center min-h-screen'>Loading...</div>

  return <div className="p-4 grid grid-cols-1 sm:grid-cols-2  md:grid-cols-3 lg:grid-cols-4 gap-5" >
    {
      videos.length > 0 &&
      videos.map((video: Video) => (
        <VideoCard key={video._id} video={video}  />
      ))
    }

    {
      hasNextPage && (
        <div
          ref={loaderRef}
          className="col-span-full text-white text-sm text-center py-4"
        >
          {isFetchingNextPage ? 'Loading more...' : 'Scroll to load more'}
        </div>
      )
    }
  </div>

}
