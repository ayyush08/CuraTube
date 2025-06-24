import { useGetTweets } from '@/hooks/tweets.hooks';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/tweets/')({
  component: RouteComponent,
})

function RouteComponent() {
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

  if( error) {
    console.error("Error fetching tweets:", error);
    return <div>Error loading tweets.</div>
  }

  console.log("Tweets Data:", data);
  return <div>Hello "/tweets/"!</div>
}
