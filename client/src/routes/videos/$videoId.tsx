import { useVideoById } from '@/hooks/video.hook'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/videos/$videoId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { videoId } = Route.useParams()
  const { data ,isLoading,isError } = useVideoById({ videoId })
  if (isError) return <div className='flex justify-center items-center min-h-screen'>Error loading video</div>
  
  if (isLoading) return <div className='flex justify-center items-center min-h-screen'>Loading...</div>
  const video = data.video;
  console.log("Video data:", video);
  return <div>Hello "/videos/${videoId}"!</div>
}
