import CommentSection from '@/components/comments/CommentSection'
import VideoSkeleton from '@/components/loaders/VideoSkeleton'
import PlaylistDialog from '@/components/playlist/PlaylistDialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { DeleteVideoDialog } from '@/components/video/DeleteVideoDialog'
import VideoCard from '@/components/video/VideoCard'
import VideoPlayer from '@/components/video/VideoPlayer'
import { useToggleVideoLike } from '@/hooks/likes.hook'
import { useToggleSubscription } from '@/hooks/subscription.hook'
import { useInfiniteVideos, useTogglePublishStatus, useUpdateViews, useVideoById } from '@/hooks/video.hook'
import { useAppSelector } from '@/redux/hooks'
import type { Video } from '@/types/video.types'

import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Heart, Loader2Icon, VideoIcon } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

export const Route = createFileRoute('/videos/$videoId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { videoId } = Route.useParams()
  const { data, isLoading:loadingVideo, isError } = useVideoById({ videoId })
  const [likeCount, setLikeCount] = useState<number | undefined>(0);
  const [isVideoLiked, setIsVideoLiked] = useState<boolean | undefined>(false)
  const [isSubscribed, setIsSubscribed] = useState<boolean | undefined>(false);
  const [subscribersCount, setSubscribersCount] = useState<number>(0);
  const [isPublished, setIsPublished] = useState<boolean | undefined>(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isPlaylistDialogOpen, setIsPlaylistDialogOpen] = useState<boolean>(false);

  const storedUser = useAppSelector(state => state.auth.user)
  const { mutate: updateViews } = useUpdateViews({ videoId })
  const { mutate: toggleLike, isPending: liking, isError: likeError } = useToggleVideoLike(setIsVideoLiked, setLikeCount);
  const { mutate: toggleSubscriber, isPending: isSubscribing, isError: subscribeError } = useToggleSubscription(setIsSubscribed, setSubscribersCount);
  const { data: suggestedVideosData } = useInfiniteVideos({ query: '', sortBy: 'views', sortType: 'desc', userId: '' })
  const { mutate: togglePublishStatus, isPending: isPublishing } = useTogglePublishStatus(setIsPublished)

  const navigate = useNavigate()


  // const video: Video = data?.video;
  const video: Video = useMemo(() => data?.video, [data]);

  const suggestedVideos: Video[] = suggestedVideosData?.pages[0].videos || [];

  // useEffect(() => {
  //   if (video) updateViews();
  // }, [videoId, video, updateViews]);

  useEffect(() => {
    if (video) {
      updateViews();
      setIsVideoLiked(video.isLiked);
      setLikeCount(video.likesCount);
      setSubscribersCount(video.owner.subscribersCount || 0);
      setIsSubscribed(video.owner.isSubscribed);
      setIsPublished(video.isPublished);

    }
  }, [video, updateViews]);

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


  if (subscribeError) console.log(subscribeError);
  if (isError) return <div className='flex justify-center items-center min-h-screen'>Error loading video</div>
  //TODO: make a skeleton that shows loading only for video area
  if (loadingVideo) return <div className=' min-h-screen'>
    <VideoSkeleton/>
  </div>
  return (
    <>
      <main className="w-full min-h-screen p-4 sm:p-5 flex flex-col lg:flex-row gap-6">
        {/* Left section: Video + Details + Comments */}
        <section className="w-full lg:max-w-3xl flex flex-col gap-6">
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
              <h2 className='text-lg text-orange-500 font-mono italic font-semibold'>{video.views} views</h2>
              <div className="flex items-center gap-5 justify-between  text-xl  p-5 w-full rounded-lg ">
                <div className='flex items-center gap-2'>
                  <button
                    aria-label='Like video'
                    disabled={liking}
                    onClick={handleLikeClick}
                    className="flex items-center cursor-pointer gap-2 px-3 py-1 rounded-md transition-all duration-300 h-auto bg-transparent  text-white hover:text-orange-500"
                  >
                    <Heart
                      className={`w-6 h-6 ${isVideoLiked ? "fill-red-500 text-red-500" : "text-neutral-400"} ${liking ? "animate-pulse scale-125" : ""}`}
                    />
                    <span className="text-lg text-red-500 font-bold">{likeCount}</span>
                  </button>

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
                {
                  isPublished && (
                    <>
                      <Button
                        variant="secondary"
                        className="border-orange-500 text-orange-500 hover:bg-orange-800/30  bg-transparent"
                        onClick={handleAddToPlaylist}
                      >
                        <VideoIcon className="mr-2 h-4 w-4" />
                        Add Video to Playlist
                      </Button>
                      <PlaylistDialog open={isPlaylistDialogOpen} videoId={video._id} onClose={() => setIsPlaylistDialogOpen(false)} />

                    </>
                  )
                }

              </div>
              <div className="flex flex-col gap-1">
                <span className="font-mono text-lg font-semibold">Description</span>
                <span className="text-base text-neutral-400">
                  {video.description}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:w-[250px] w-full flex-shrink gap-5">

              <div className="flex flex-col gap-2">
                {
                  storedUser?._id === video.owner._id && (
                    <>
                      <Button

                        className="self-end border-2 border-red-500 bg-red-600/30 text-red-500 hover:bg-red-500 hover:text-neutral-100 transition-colors duration-300"
                        onClick={() => setShowDeleteDialog(true)}
                      >
                        Delete Video
                      </Button>
                      <DeleteVideoDialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)} videoId={video._id} />
                    </>
                  )
                }
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
          <Separator className='mt-8 bg-orange-400 py-[1px] w-full' />
          {/* Comments */}
          <div className="min-h-[50vh] sm:min-h-[60vh] lg:min-h-[100vh] p-5 rounded-xl">
            <CommentSection key={video._id} videoId={video._id} />
          </div>
        </section>

        {/* Suggestions */}
        <section className="w-full lg:w-[400px] flex-shrink p-5 min-h-[50vh] sm:min-h-[60vh] lg:min-h-screen rounded-xl">

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
