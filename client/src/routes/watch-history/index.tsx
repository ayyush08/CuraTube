import VideoTile, { type VideoTileProps } from '@/components/video/VideoTile'
import { useAuthGuard } from '@/hooks/helpers/use-auth-guard'
import { useWatchHistory } from '@/hooks/user.hook'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/watch-history/')({
  component: RouteComponent,
})

function RouteComponent() {
  useAuthGuard()
  const { data: watchHistory, isLoading, isError } = useWatchHistory()
  if (isError) {
    console.log(isError);
    return

  }
  console.log(watchHistory);
  if (isLoading) return <div>Loading...</div>;
  return <div>
    {
    watchHistory.map((history: VideoTileProps,) => (
      <VideoTile key={history.video._id} video={history.video} watchedAt={history.watchedAt} />
    ))
  }
  </div>
}
