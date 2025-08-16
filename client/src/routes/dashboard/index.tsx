import { Analytics } from '@/components/dashboard/Analytics'
import { RecentVideos } from '@/components/dashboard/RecentVideos'
import { Separator } from '@/components/ui/separator'
import { useGetChannelStats, useGetRecentVideos } from '@/hooks/dashboard.hook'
import { useAuthGuard } from '@/hooks/helpers/use-auth-guard'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/')({
  component: RouteComponent,
})

function RouteComponent() {
  useAuthGuard()
  const { data: stats, isLoading:loadingStats } = useGetChannelStats()
  const { data: recentVideos, isLoading:loadingRecentVideos } = useGetRecentVideos()
  console.log(recentVideos);

  return (
    <main className='p-5 flex flex-col justify-center  w-full'>
      <h1 className='text-5xl text-center mb-4 text-orange-500 font-bold'>Dashboard</h1>
      <Analytics stats={stats} loading={loadingStats} />
      <h2 className='text-3xl mt-5 p-2 text-orange-500 font-bold'>Recent Videos</h2>
      <Separator className='mb-8 bg-orange-500 py-[1px] w-full' />
      <RecentVideos videos={recentVideos} loading={loadingRecentVideos} />
    </main>
  )
}
