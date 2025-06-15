
import VideoCard, { type Video } from '@/components/video/VideoCard';
import { useGetVideosForHome } from '@/hooks/video.hook';
import { useAppSelector } from '@/redux/hooks';
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react';

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  const userState = useAppSelector((state)=>state.auth.user)

  
  const { data:videos,isLoading} = useGetVideosForHome();

  useEffect(()=>{
    console.log(videos);
    
  },[videos])



  if(isLoading) return <div className='flex justify-center items-center min-h-screen'>Loading...</div>

  console.log(userState);
  return <div className='p-2 flex sm:flex-row flex-col justify-center items-center gap-5' >
    {
      videos.length > 0 && videos.map((video:Video)=>{
        return <VideoCard key={video._id} video={video} />
      })
    }
    </div>
}
