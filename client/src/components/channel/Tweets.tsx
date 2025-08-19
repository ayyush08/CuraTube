import { Loader2Icon } from 'lucide-react';
import { useEffect, useRef } from 'react'
import TweetCard from '../tweets/TweetCard';
import type { Tweet } from '@/types/tweets.types';
import { useGetTweets } from '@/hooks/tweets.hooks';
import { useAppSelector } from '@/redux/hooks';
import WideSkeleton from '../loaders/WideSkleleton';



const Tweets = ({userId}:{userId:string | undefined}) => {
    const storedUser = useAppSelector((state) => state.auth.user);
    const { data, isLoading, error, hasNextPage, fetchNextPage, isFetchingNextPage } = useGetTweets({
        sortBy: 'createdAt',
        sortType: 'desc',
        userId,
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
        return (
            <WideSkeleton count={4}/>
        )
    }

    if (error) {
        console.error("Error fetching tweets:", error);
        return <div>Error loading tweets.</div>
    }

    const tweets = data?.pages.flatMap((page) => page.tweets) || [];

    if (tweets.length === 0) {
        return <div className="text-center text-xl p-4 font-semibold font-mono text-orange-400 w-full">No tweets found. <br /> 
        {
            storedUser?._id === userId ? (
                <span>Create your first tweet to get started!</span>
            ) : (
                <span>This user has no tweets.</span>
            )
        }
        </div>;
    }
    return <section className="flex flex-col w-full">
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

export default Tweets