import { useAuthGuard } from '@/hooks/helpers/use-auth-guard'
import { useAppSelector } from '@/redux/hooks'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/profile/')({
  component: RouteComponent,
})

function RouteComponent() {
  useAuthGuard()
  const user = useAppSelector((state)=>state.auth.user)
  console.log(user);
  
  return (
    <main className='p-5 flex flex-col gap-5 '>
      {/* //pfp and cover image div */}
      <div className='w-full h-96 relative mb-10'>
        {/* add edit cover image and pfp buttons */}
        <img
        src={user?.coverImage}
        alt={user?.username}
        className='object-fit h-full w-full rounded-lg border-x-4 border-t-4 border-orange-500 shadow-lg shadow-orange-400/20 aspect-video'
        />
        <img
        src={user?.avatar}
        alt={user?.fullName}
        className='object-cover h-40 w-40 left-3 -bottom-10  border-4 border-orange-400 rounded-full absolute shadow-lg shadow-orange-400/20'
        />

      </div>
      {/* //username and full name */}
      <div className="flex flex-col items-start gap-2 w-full">
        <h1 className='text-4xl font-bold text-orange-500'>{user?.fullName}</h1>
        <h2 className='text-2xl text-neutral-500'>@{user?.username}</h2>
        <p className='text-base text-gray-500 self-end font-semibold'>
          Joined on {user?.createdAt ? new Date(user.createdAt).toUTCString() : 'Unknown'}
        </p>
      </div>
      {/* TODO: a shadcn Tabs component to switch between videos,tweets, comments,etc sections */}
    </main>
  )
}
