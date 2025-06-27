
import TweetCard from '@/components/tweets/TweetCard'

import { createFileRoute } from '@tanstack/react-router'


export const Route = createFileRoute('/test-component/')({
  component: RouteComponent,
})



function RouteComponent() {
  return <TweetCard />;
}



