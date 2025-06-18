import { Button } from '@/components/ui/button'
import VideoPlayer from '@/components/video/VideoPlayer'
import { useToggleVideoLike } from '@/hooks/likes.hook'
import { useToggleSubscription } from '@/hooks/subscription.hook'
import { useUpdateViews, useVideoById } from '@/hooks/video.hook'
import { useAppSelector } from '@/redux/hooks'
import type { Video } from '@/types/video.types'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import axios from 'axios'
import { Loader2Icon, ThumbsUpIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export const Route = createFileRoute('/videos/$videoId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { videoId } = Route.useParams()
  const { data, isLoading, isError } = useVideoById({ videoId })
  const [likeCount, setLikeCount] = useState<number | undefined>(0);
  const [isVideoLiked, setIsVideoLiked] = useState<boolean>(false)
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [subscribersCount, setSubscribersCount] = useState<number>(0);
  const storedUser = useAppSelector(state => state.auth.user)
  const { mutate: updateViews } = useUpdateViews({ videoId })
  const { mutate: toggleLike, isPending: liking, isError: likeError } = useToggleVideoLike(setIsVideoLiked, setLikeCount)
  const { mutate: toggleSubscriber, isPending: isSubscribing, isError: subscribeError } = useToggleSubscription(setIsSubscribed, setSubscribersCount)
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
          if (storedUser) setIsVideoLiked(video.likedBy === storedUser._id);
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
  }, [video?.videoFile, videoSrc, updateViews, video?.likedBy, storedUser, video?.likesCount]);


  const handleOwnerClick = (channelId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    navigate({
      to: `/channel/${channelId}`
    })
  }

  const handleLikeClick = () => {
    if (liking) return;
    if (likeError) console.log("like error", likeError);

    toggleLike(videoId)
  }

  const handleSubscribeToggle = () => {
    if (!storedUser) toast.error("Please login to subscribe")
    toggleSubscriber(video.owner._id as string)
    console.log('sub buton clicked');

  }


  if (subscribeError) console.log(subscribeError);
  if (isError) return <div className='flex justify-center items-center min-h-screen'>Error loading video</div>
  //TODO: make a skeleton that shows loading only for video area
  if (isLoading || isProcessing || !hlsVideoSrc) return <div className='flex justify-center items-center min-h-screen'>Loading...</div>
  return (
    <>
      <main className="w-full min-h-screen p-4 sm:p-5 flex flex-col lg:flex-row gap-6">
        {/* Left section: Video + Details + Comments */}
        <section className="w-full lg:max-w-3xl flex flex-col gap-6">
          {/* Video Player */}
          <div className="w-full p-2">
            <VideoPlayer
              src={hlsVideoSrc}
              duration={video.duration}
              thumbnail={video.thumbnail}
              title={video.title}
              autoPlay={true}
            />
          </div>

          {/* Title, Description & Owner Info */}
          <div className="flex flex-col sm:flex-row sm:justify-between  sm:items-center gap-5 p-5 rounded-lg bg-neutral-900/20">
            <div className="flex flex-col gap-4 sm:max-w-[55%]">
              <h1 className="text-2xl md:text-3xl lg:text-4xl text-white font-bold tracking-wide">
                {video.title}
              </h1>
              <div className="flex flex-col gap-1">
                <span className="font-mono text-lg font-semibold">Description</span>
                <span className="text-base text-neutral-400">
                  {video.description}
                </span>
              </div>
            </div>

            <div className="flex gap-5 items-center flex-wrap justify-between  sm:flex-nowrap">
              <div className="flex items-center gap-2 text-xl">
                <ThumbsUpIcon
                  onClick={handleLikeClick}
                  className={`w-6 h-6 cursor-pointer ${isVideoLiked ? 'fill-orange-500 text-orange-500' : 'text-orange-500'
                    }`}
                />
                {likeCount}
              </div>
              <div className="flex flex-col gap-2">

                <div
                  onClick={(e) => handleOwnerClick(video.owner.username, e)}
                  className="flex gap-2 items-center hover:bg-amber-500/10 transition-colors duration-300 cursor-pointer rounded-2xl p-3 w-full"
                >
                  <img
                    src={video.owner.avatar}
                    alt={video.owner.username}
                    className="rounded-full object-cover h-16 w-16"
                  />
                  <div className="flex flex-col">
                    <p className="text-sm sm:text-lg font-semibold text-neutral-100">
                      {video.owner.fullName}
                    </p>
                    <p className="text-xs sm:text-sm text-neutral-500">
                      @{video.owner.username}
                    </p>
                  </div>
                </div>
                <p className='text-lg text-orange-500 italic font-semibold font-mono'>Subscribers: {subscribersCount}</p>
                
                {storedUser?.username !== video.owner.username && (
                  <Button
                    onClick={handleSubscribeToggle}
                    disabled={isSubscribing}
                    className={`p-5 rounded-lg border-2 cursor-pointer font-bold text-lg transition-all duration-300 ${isSubscribed
                      ? 'bg-orange-200 text-orange-600 border-orange-500 hover:bg-orange-400 hover:text-white italic'
                      : 'bg-orange-500 text-white border-orange-600 hover:bg-orange-600'
                      } ${isSubscribing ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isSubscribing
                      ? <Loader2Icon className='animate-spin w-full text-lg m-5 scale-125' />
                      : isSubscribed
                        ? 'Subscribed'
                        : 'Subscribe'}
                  </Button>
                )}
              </div>
            </div>

          </div>

          {/* Comments */}
          <div className="min-h-[50vh] sm:min-h-[60vh] lg:min-h-[100vh] p-5 bg-blue-700/30 rounded-xl">
            Comments section
          </div>
        </section>

        {/* Suggestions */}
        <section className="w-full lg:w-[400px] flex-shrink-0 p-5 bg-pink-400 min-h-[50vh] sm:min-h-[60vh] lg:min-h-screen rounded-xl">
          Suggestions
        </section>
      </main>

    </>
  )


}
