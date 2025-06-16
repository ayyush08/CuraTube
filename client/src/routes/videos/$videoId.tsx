import VideoPlayer from '@/components/video/VideoPlayer'
import { useVideoById } from '@/hooks/video.hook'
import type { VideoByIdType } from '@/types/video.types'
import { createFileRoute } from '@tanstack/react-router'
import axios from 'axios'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/videos/$videoId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { videoId } = Route.useParams()
  const { data, isLoading, isError } = useVideoById({ videoId })
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [hlsVideoSrc, setHlsVideoSrc] = useState<string>('')

  const video: VideoByIdType = data?.video;
  const videoSrc = `${video?.videoFile}/ik-master.m3u8?tr=sr-240_360_480_720`;
  useEffect(() => {
    let interval: NodeJS.Timeout;

    async function checkVideoReady() {
      try {
        const res = await axios.get(videoSrc);
        if (res.status === 200) {
          setHlsVideoSrc(videoSrc);
          setIsProcessing(false);
          clearInterval(interval);
        } else if (res.status === 202) {
          console.log("Video still processing...");
        } else {
          throw new Error("Unexpected response status: " + res.status);
        }
      } catch (error) {
        console.error("Error while checking HLS readiness:", error);
        setIsProcessing(false);
        clearInterval(interval);
      }
    }

    if (video?.videoFile) {
      setIsProcessing(true);
      // Start polling every 3s
      interval = setInterval(checkVideoReady, 3000);
      checkVideoReady();
    }

    return () => clearInterval(interval);
  }, [video?.videoFile, videoSrc]);

  if (isError) return <div className='flex justify-center items-center min-h-screen'>Error loading video</div>
  //TODO: make a skeleton that shows loading only for video area
  if (isLoading || isProcessing || !hlsVideoSrc) return <div className='flex justify-center items-center min-h-screen'>Loading...</div>
  return (
    <>
      <main className="w-full min-h-screen p-5 flex flex-col lg:flex-row gap-5">
        {/* Left section (Video + Details + Comments) */}
        <section className="w-full lg:max-w-3xl flex flex-col gap-5">
          {/* Video */}
          <div className="w-full mb-5 p-2">
            <VideoPlayer
              src={hlsVideoSrc}
              duration={video.duration}
              thumbnail={video.thumbnail}
              title={video.title}
              autoPlay
            />
          </div>

          {/* Title & Description */}
          <div className="px-2 flex flex-col gap-5">
            <h1 className="text-4xl text-white font-bold tracking-wide">{video.title}</h1>
            <div className="flex flex-col">
              <span className="font-mono text-xl font-semibold">Description</span>
              <span className="text-base text-neutral-500">{video.description}</span>
            </div>
          </div>

          {/* Comments */}
          <div className="min-h-[100vh] p-5 bg-blue-700/30">
            Comments section
          </div>
        </section>

        {/* Suggestions (always on side in desktop, below on mobile) */}
        <section className="w-full lg:w-[400px] flex-shrink-0 p-5 bg-pink-400 min-h-screen">
          Suggestions
        </section>
      </main>

    </>
  )


}
