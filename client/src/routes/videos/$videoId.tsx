import VideoPlayer from '@/components/video/VideoPlayer'
import { useToggleVideoLike } from '@/hooks/likes.hook'
import { useUpdateViews, useVideoById } from '@/hooks/video.hook'
import { useAppSelector } from '@/redux/hooks'
import type { Video } from '@/types/video.types'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import axios from 'axios'
import { ThumbsUpIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/videos/$videoId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { videoId } = Route.useParams()
  const { data, isLoading, isError } = useVideoById({ videoId })
  const [likeCount, setLikeCount] = useState<number | undefined>(0);
  const [isVideoLiked, setIsVideoLiked] = useState<boolean>(false)
  const loggedInUser = useAppSelector(state => state.auth.user?._id)
  const { mutate: updateViews } = useUpdateViews({ videoId })
  const { mutate: toggleLike, isPending: liking, isError: likeError } = useToggleVideoLike(setIsVideoLiked,setLikeCount)
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [hlsVideoSrc, setHlsVideoSrc] = useState<string>('')

  const navigate = useNavigate()

  const video: Video = data?.video;
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
          updateViews();
          if (loggedInUser) setIsVideoLiked(video.likedBy === loggedInUser)
          setLikeCount(video.likesCount)
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
  }, [video?.videoFile, videoSrc, updateViews, video?.likedBy, loggedInUser, video?.likesCount]);


  const handleOwnerClick = (userId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    navigate({
      to: `/public-profile/${userId}`
    })
  }

  const handleLikeClick = () => {
    if (liking) return;
    if (likeError) console.log("like error", likeError);

    toggleLike(videoId)
  }

  // console.log(video);



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
          <div className="flex justify-between items-center p-2 rounded-lg">

            <div className="px-2 flex flex-col  gap-10">
              <h1 className="text-4xl text-white font-bold tracking-wide">{video.title}</h1>
              <div className="flex flex-col">
                <span className="font-mono text-xl font-semibold">Description</span>
                <span className="text-base text-neutral-500">{video.description}</span>
              </div>
            </div>
            <div className="flex gap-5">

              <div className="flex gap-2 text-xl items-center">
                <ThumbsUpIcon

                  onClick={handleLikeClick}
                  className={`w-6 cursor-pointer text-orange-500 h-6  ${isVideoLiked
                    ? ' fill-orange-500'
                    : ' '
                    }`}
                />
                {likeCount}
              </div>
              <div onClick={(e) => handleOwnerClick(video.owner._id, e)} className=" flex gap-2 hover:bg-amber-500/10 transition-colors duration-300 hover:cursor-pointer rounded-2xl p-3">
                <img
                  src={video.owner.avatar}
                  alt={video.owner.username}
                  className='rounded-full object-cover h-10 w-10 aspect-square'
                />
                <div>
                  <p className='text-sm sm:text-base font-semibold text-neutral-100'>{video.owner.fullName}</p>
                  <p className='text-xs sm:text-sm text-neutral-500'>@{video.owner.username}</p>
                </div>
              </div>
            </div>
          </div>


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
