import TweetCard from '@/components/tweets/TweetCard';
import TweetWriter from '@/components/tweets/TweetWriter';
import { useGetTweets } from '@/hooks/tweets.hooks';
import { useAppSelector } from '@/redux/hooks';
import type { Tweet } from '@/types/tweets.types';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/tweets/')({
  component: RouteComponent,
})

function RouteComponent() {
  const storedUser = useAppSelector(state => state.auth.user)
  const { data, isLoading, error } = useGetTweets({
    sortBy: 'updatedAt',
    sortType: 'desc',
    userId: '',
    page: 1,
    limit: 10
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    console.error("Error fetching tweets:", error);
    return <div>Error loading tweets.</div>
  }

  console.log("Tweets Data:", data);
  return <section className="flex flex-col w-full">
    {
      storedUser && <TweetWriter/>
    }
    {data?.tweets?.map((tweet: Tweet) => (
      <div className="w-full p-5 mx-auto" key={tweet._id}>
        <TweetCard  {...tweet} />
      </div>

    ))}
  </section>
}
