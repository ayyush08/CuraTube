import { useAuthGuard } from '@/hooks/helpers/use-auth-guard'
import { useAppSelector } from '@/redux/hooks'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/my-profile/')({
  component: RouteComponent,
})

interface TabItem {
  value: string
  content: string
}

const TabItems: TabItem[] = [
  {
    value: "Your Videos",
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
  useAuthGuard()
  const user = useAppSelector((state) => state.auth.user)



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
      {/* //username and full name */}
      <div className="flex flex-col items-start gap-2 w-full">
        <h1 className='text-2xl font-bold text-orange-500'>{user?.fullName}</h1>
        <h2 className='text-lg text-neutral-500'>@{user?.username}</h2>
        <p className='text-sm text-gray-500 self-end font-semibold'>
          Joined on {user?.createdAt ? new Date(user.createdAt).toUTCString() : 'Unknown'}
        </p>
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
