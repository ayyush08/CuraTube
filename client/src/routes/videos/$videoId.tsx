import PlaylistDialog from '@/components/playlist/PlaylistDialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import VideoCard from '@/components/video/VideoCard'
import VideoPlayer from '@/components/video/VideoPlayer'
import { useToggleVideoLike } from '@/hooks/likes.hook'
import { useToggleSubscription } from '@/hooks/subscription.hook'
import { useInfiniteVideos, useTogglePublishStatus, useUpdateViews, useVideoById } from '@/hooks/video.hook'
import { useAppSelector } from '@/redux/hooks'
import type { Video } from '@/types/video.types'

import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Loader2Icon, ThumbsUpIcon, VideoIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export const Route = createFileRoute('/videos/$videoId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { videoId } = Route.useParams()
  const { data, isLoading, isError } = useVideoById({ videoId })
  const [likeCount, setLikeCount] = useState<number | undefined>(0);
  const [hasInitialized, setHasInitialized] = useState<boolean>(false);
  const [isVideoLiked, setIsVideoLiked] = useState<boolean | undefined>(false)
  const [isSubscribed, setIsSubscribed] = useState<boolean | undefined>(false);
  const [subscribersCount, setSubscribersCount] = useState<number>(0);
  const [isPublished, setIsPublished] = useState<boolean | undefined>(false);

  const [isPlaylistDialogOpen, setIsPlaylistDialogOpen] = useState<boolean>(false);

  const storedUser = useAppSelector(state => state.auth.user)
  const { mutate: updateViews } = useUpdateViews({ videoId })
  const { mutate: toggleLike, isPending: liking, isError: likeError } = useToggleVideoLike(setIsVideoLiked, setLikeCount);
  const { mutate: toggleSubscriber, isPending: isSubscribing, isError: subscribeError } = useToggleSubscription(setIsSubscribed, setSubscribersCount);
  const { data: suggestedVideosData } = useInfiniteVideos({ query: '', sortBy: 'views', sortType: 'desc', userId: '' })
  const { mutate: togglePublishStatus, isPending: isPublishing } = useTogglePublishStatus(setIsPublished)

  const navigate = useNavigate()

  const video: Video = data?.video;
  const suggestedVideos: Video[] = suggestedVideosData?.pages[0].videos || [];


  useEffect(() => {
    if (video && !hasInitialized) {
      updateViews();
      setIsVideoLiked(video.isLiked);
      setLikeCount(video.likesCount);
      setSubscribersCount(video.owner.subscribersCount || 0);
      setIsSubscribed(video.owner.isSubscribed);
      setIsPublished(video.isPublished);
      setHasInitialized(true);
      
    }
  }, [video, updateViews, hasInitialized]);

  const handleOwnerClick = (channelId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    navigate({
      to: `/channel/${channelId}`
    })
  }

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (liking) return;
    if (!storedUser) {
      toast.error("Please login to like the video")
      return
    }
    if (likeError) console.log("like error", likeError);

    toggleLike(videoId)
  }

  const handleSubscribeToggle = () => {
    if (!storedUser) {
      toast.error("Please login to subscribe")
      return

    }
    toggleSubscriber(video.owner._id as string)
  }

  const handlePublishToggle = () => {
    if (!storedUser) {
      toast.error("Please login to publish the video")
      return
    }
    console.log("Publish toggle clicked", video.isPublished);
    // Call API to update video publish status
    togglePublishStatus(videoId);
  }

  const handleAddToPlaylist = () => {
    if (!storedUser) {
      toast.error("Please login to add video to playlist")
      return
    }
    setIsPlaylistDialogOpen(true);
  }

  console.log(video, "Video data in video route");

  if (subscribeError) console.log(subscribeError);
  if (isError) return <div className='flex justify-center items-center min-h-screen'>Error loading video</div>
  //TODO: make a skeleton that shows loading only for video area
  if (isLoading) return <div className='flex justify-center items-center min-h-screen'>Loading...</div>
  return (
    <>
      <main className="w-full min-h-screen p-4 sm:p-5 flex flex-col lg:flex-row gap-6">
        {/* Left section: Video + Details + Comments */}
        <section className="w-full lg:max-w-3xl flex flex-col gap-6">
          {/* Video Player */}
          <div className="w-full p-2">
            <VideoPlayer
              src={video.videoFile}
              duration={video.duration}
              thumbnail={video.thumbnail}
              title={video.title}
              autoPlay={true}
            />
          </div>

          {/* Title, Description & Owner Info */}
          <div className="flex flex-col sm:flex-row w-full sm:items-center gap-5 p-5 rounded-lg bg-neutral-900/20">
            <div className="flex flex-col flex-1 min-w-0 gap-4">
              <h1 className="text-2xl md:text-3xl lg:text-3xl text-white font-bold tracking-wide">
                {video.title}
              </h1>
              <div className="flex items-center gap-5 justify-between  text-xl border-2 p-5 w-full rounded-lg bg-neutral-800/20">
                <div className='flex items-center gap-2'>

                  <ThumbsUpIcon
                    onClick={(e) => handleLikeClick(e)}
                    className={`w-6 h-6 cursor-pointer ${isVideoLiked ? 'fill-orange-500 text-orange-500' : 'text-orange-500'
                      }`}
                  />
                  <span>
                    {likeCount}
                  </span>
                  {
                    storedUser?._id === video.owner._id && (
                      <div className="flex items-center space-x-2">
                        {isPublishing ? (
                          <Loader2Icon className='animate-spin w-6 h-6 text-orange-500' />
                        ) : (

                          <Switch
                            id="isPublished"
                            checked={isPublished}
                            name='Toggle Publish Status'
                            onCheckedChange={handlePublishToggle}
                            className="data-[state=checked]:bg-orange-500 cursor-pointer ml-5"
                          />
                        )}
                        <Label htmlFor="isPublished">{isPublished ? "Unpublish" : "Publish"}</Label>
                      </div>
                    )
                  }
                </div>
                <Button
                  variant="outline"
                  className="border-orange-500 text-orange-500 hover:bg-orange-500  bg-transparent"
                  onClick={handleAddToPlaylist}
                >
                  <VideoIcon className="mr-2 h-4 w-4" />
                  Add Video to Playlist
                </Button>
                <PlaylistDialog open={isPlaylistDialogOpen} videoId={video._id} onClose={() => setIsPlaylistDialogOpen(false)} />
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-mono text-lg font-semibold">Description</span>
                <span className="text-base text-neutral-400">
                  {video.description}
                </span>
              </div>
            </div>

            <div className="fflex flex-col sm:w-[250px] flex-shrink-0 gap-5">
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
                    <p className="text-sm sm:text-base font-semibold text-neutral-100">
                      {video.owner.fullName}
                    </p>
                    <p className="text-xs sm:text-sm text-neutral-500">
                      @{video.owner.username}
                    </p>
                  </div>
                </div>
                <p className='text-sm text-orange-700  font-semibold font-mono'>Subscribers: {subscribersCount}</p>

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
        <section className="w-full lg:w-[400px] flex-shrink-0 p-5  min-h-[50vh] sm:min-h-[60vh] lg:min-h-screen rounded-xl">
          <div className="flex flex-col gap-4 ">
            <h2 className="text-2xl italic font-bold text-center text-orange-500">Suggested Videos</h2>
            {suggestedVideos?.map((vid) => {

              if (vid._id !== video._id) {
                return <VideoCard key={vid._id} video={vid} />
              }
            })}
          </div>
        </section>
      </main>

    </>
  )


}
