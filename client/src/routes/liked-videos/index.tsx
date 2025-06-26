import VideoTile from '@/components/video/VideoTile'
import { useAuthGuard } from '@/hooks/helpers/use-auth-guard'
import { useGetLikedVideos } from '@/hooks/likes.hook'
import type { LikedVideo } from '@/types/likes.type'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/liked-videos/')({
  component: RouteComponent,
})

function RouteComponent() {
  useAuthGuard('/')
  const { data: likedVideos, isLoading, isError } = useGetLikedVideos()

  if (isError) {
    console.error(isError);
    return <div>Error loading liked videos</div>
  }
  if (isLoading) return <div>Loading...</div>;

  console.log(likedVideos);

  return <div>
    <h1 className='text-3xl p-5 font-bold text-center text-orange-600 '>Your Liked Videos</h1>
    {
      likedVideos.map((video: LikedVideo) => (
        <VideoTile key={video._id} video={video.videoDetails} likedOn={video.createdAt} />
      ))
    }
  </div>
}
