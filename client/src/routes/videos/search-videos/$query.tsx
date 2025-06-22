import VideoTile from '@/components/video/VideoTile';
import { useInfiniteVideos } from '@/hooks/video.hook';
import type { Video } from '@/types/video.types';
import { createFileRoute } from '@tanstack/react-router'
import { Search } from 'lucide-react';
import { useEffect, useRef } from 'react';

export const Route = createFileRoute('/videos/search-videos/$query')({
  component: RouteComponent,
})

function RouteComponent() {
  const query = Route.useParams().query;
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteVideos({ query })
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const videos = data?.pages[0].videos || [];

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

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    return <div>Error loading videos</div>
  }

console.log(videos);

  if( videos.length === 0) {
    return <div>No videos found</div>
  }

  return <div className="p-5" >
    <h1 className='text-3xl font-bold flex items-center gap-2 text-orange-600 mb-5'><Search/>Search Results for "{query}"</h1>
    {
      videos.length > 0 &&
      videos.map((video: Video) => (
        <VideoTile key={video._id} video={video} />
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
