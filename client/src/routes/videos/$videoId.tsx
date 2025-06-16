import VideoPlayer from '@/components/video/VideoPlayer'
import { useVideoById } from '@/hooks/video.hook'
import type { VideoByIdType } from '@/types/video.types'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/videos/$videoId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { videoId } = Route.useParams()
  const { data, isLoading, isError } = useVideoById({ videoId })
  if (isError) return <div className='flex justify-center items-center min-h-screen'>Error loading video</div>

  if (isLoading) return <div className='flex justify-center items-center min-h-screen'>Loading...</div>
  const video: VideoByIdType = data.video;
  console.log("Video data:", video);
  return (
    <main className='w-full min-h-screen p-5'>

      <div className="w-[60vw]  bg-red-100/50">
        <VideoPlayer src={`${video.videoFile}/ik-master.m3u8?tr=sr-240_360_480_720`} duration={video.duration} thumbnail={video.thumbnail} title={video.title} autoPlay  />
        <h1>{video.title}</h1>
        <h2>{video.description}</h2>
      </div>

    </main>
  )


}
