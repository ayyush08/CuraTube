import WideSkeleton from '@/components/loaders/WideSkleleton';
import TweetCard from '@/components/tweets/TweetCard';
import TweetWriter from '@/components/tweets/TweetWriter';
import { useGetTweets } from '@/hooks/tweets.hooks';
import { useAppSelector } from '@/redux/hooks';
import type { Tweet } from '@/types/tweets.types';
import { createFileRoute } from '@tanstack/react-router'
import { Loader2Icon } from 'lucide-react';
import { useEffect, useRef } from 'react';

export const Route = createFileRoute('/tweets/')({
  component: RouteComponent,
})

function RouteComponent() {
  const storedUser = useAppSelector(state => state.auth.user)
  const { data, isLoading, error, hasNextPage, fetchNextPage, isFetchingNextPage } = useGetTweets({
    sortBy: 'createdAt',
    sortType: 'desc',
    userId: '',
    page: 1,
    limit: 2
  })

  const loaderRef = useRef<HTMLDivElement>(null);

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


  if (isLoading) {
    return <WideSkeleton count={5} />
  }

  if (error) {
    console.error("Error fetching tweets:", error);
    return <div>Error loading tweets.</div>
  }

  const tweets = data?.pages.flatMap((page) => page.tweets) || [];

  // console.log("Tweets Data:", data);
  return <section className="flex flex-col w-full">
    {
      storedUser && <TweetWriter />
    }
    {tweets.map((tweet: Tweet) => (
      <div className="w-full p-5 mx-auto" key={tweet._id}>
        <TweetCard  {...tweet} />
      </div>
    ))}
    {
      hasNextPage && (
        <div
          ref={loaderRef}
          className="col-span-full border-2  text-white text-sm text-center py-4"
        >
          {isFetchingNextPage ?
            <Loader2Icon className='animate-spin w-4 h-4 inline-block' /> : null}
        </div>
      )
    }
  </section>
}
