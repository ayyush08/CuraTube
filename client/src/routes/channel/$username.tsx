
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { createFileRoute } from '@tanstack/react-router'

import { useUserChannelProfile } from '@/hooks/user.hook'
import { useAppSelector } from '@/redux/hooks'
import { useEffect, useState } from 'react'

import { toast } from 'sonner'
import { useToggleSubscription } from '@/hooks/subscription.hook'
import { Button } from '@/components/ui/button'
import { Loader2Icon } from 'lucide-react'

export const Route = createFileRoute('/channel/$username')({
  component: RouteComponent,
})

interface TabItem {
  value: string
  content: string
}

const TabItems: TabItem[] = [
  {
    value: " Videos",
    content: "This will be all your videos"
  },
  {
    value: 'Playlists',
    content: "This will be playlists"
  },
  {
    value: "Tweets",
    content: "These will be all your tweets",
  }
]

function RouteComponent() {
  const { username } = Route.useParams()
  const storedUser = useAppSelector(state => state.auth.user)
  const { data: user, isLoading, isError } = useUserChannelProfile(username, storedUser?._id || '');
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [subscribersCount, setSubscribersCount] = useState<number>(0);
  const { mutate: toggleSubscriber, isPending: isSubscribing, isError: subscribeError } = useToggleSubscription(setIsSubscribed, setSubscribersCount)
  useEffect(() => {
    if (user) {
      console.log(user);

      setIsSubscribed(user.isSubscribed);
      setSubscribersCount(user.subscribers);
    }
  }, [user])
  if (isLoading) return <div> Loading</div>
  if (isError) console.log(isError);
  if (subscribeError) console.log(subscribeError);


  const handleSubscribeToggle = () => {
    if (!storedUser) toast.error("Please login to subscribe")
    toggleSubscriber(user?._id as string)
    console.log('sub buton clicked');

  }
  return (
    <main className='p-5 flex flex-col gap-5 '>
      {/* //pfp and cover image div */}
      <div className='w-full h-72 relative mb-10'>
        {/* add edit cover image and pfp buttons */}
        <img
          src={user?.coverImage}
          alt={user?.username}
          className='object-cover h-full w-full rounded-md border-x-2 border-t-4 border-orange-500 shadow-lg shadow-amber-500/30 aspect-video'
        />
        <img
          src={user?.avatar}
          alt={user?.fullName}
          className='object-cover h-40 w-40 left-3 -bottom-10  border-2 border-orange-400 rounded-full absolute shadow-lg shadow-cyan-500/30'
        />

      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full p-5 rounded-xl  shadow-md gap-4">

        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-orange-500">{user?.fullName}</h1>
          <h2 className="text-lg text-neutral-400 font-semibold">@{user?.username}</h2>
        </div>


        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 text-sm sm:text-base font-bold text-white">
          <div>
            Subscribers - <span className="text-orange-400">{subscribersCount ?? 0}</span>
          </div>
          <div>
            Following -  <span className="text-orange-400">{user?.channelsSubscribed ?? 0}</span>
          </div>

          {storedUser?.username !== username && (
            <Button
              onClick={handleSubscribeToggle}
              disabled={isSubscribing}
              className={`p-5 rounded-lg border-2 cursor-pointer font-extrabold text-lg transition-all duration-300 ${isSubscribed
                ? 'bg-orange-200 text-orange-600 border-orange-500 hover:bg-orange-400 hover:text-white italic'
                : 'bg-orange-500 text-white border-orange-600 hover:bg-orange-600'
                } ${isSubscribing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSubscribing
                ? <Loader2Icon className='animate-spin w-full text-lg m-5 scale-125' />
                : isSubscribed
                  ? 'Subscribed'
                  : 'Subscribe'}
            </Button>
          )}
        </div>
      </div>

      {/* TODO: a shadcn Tabs component to switch between videos,tweets, comments,etc sections */}
      <div className="flex w-full max-w-sm flex-col gap-6">

        <Tabs defaultValue={TabItems[0].value}>
          <TabsList className='p-6 bg-orange-600/50 '>
            {TabItems.map((tab) => (
              <TabsTrigger className='dark:data-[state=active]:text-black text-white hover:cursor-pointer text-lg data-[state=active]:border-amber-500 border-2 px-5 mx-2 py-4 data-[state=active]:bg-yellow-200/75 transition-all duration-300 hover:border-amber-500 ' key={tab.value} value={tab.value}>
                {`${tab.value.charAt(0).toUpperCase()}${tab.value.slice(1)}`}
              </TabsTrigger>
            ))}
          </TabsList>
          {TabItems.map((tab) => (
            <TabsContent key={tab.value} value={tab.value}>
              {tab.content}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </main>
  )
}
