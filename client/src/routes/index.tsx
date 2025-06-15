
import { getAllVideosForHome } from '@/api/videos.api';
import VideoCard, { type Video } from '@/components/video/VideoCard';
import { useAppSelector } from '@/redux/hooks';
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react';

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  const userState = useAppSelector((state)=>state.auth.user)
  const [videos,setVideos] = useState<Video[]>([])
  const [loading,setLoading] = useState<boolean>(true)

  useEffect(() => {
    async function fetchVideos() {
      try {
        setLoading(true);
        const allVideos = await getAllVideosForHome();
        console.log(allVideos);
        
        setVideos(allVideos.videos);
      } catch (error) {
        console.log(error);
        
      }finally{
        setLoading(false);
      }
    }
    fetchVideos();
  }, []);


  if(loading) return <div className='flex justify-center items-center min-h-screen'>Loading...</div>

  console.log(userState);
  return <div className='p-2 flex sm:flex-row flex-col justify-center items-center gap-5' >
    {
      videos.length > 0 && videos.map((video)=>{
        return <VideoCard key={video._id} video={video} />
      })
    }
    </div>
}
