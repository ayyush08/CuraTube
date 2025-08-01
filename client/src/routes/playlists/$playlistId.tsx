import { DeletePlaylistDialog } from '@/components/playlist/DeletePlaylistDialog'
import { DeleteVideoFromPlaylistDialog } from '@/components/playlist/DeleteVidFromPlaylistDialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import VideoTile from '@/components/video/VideoTile'
import { useGetPlaylistById, useUpdatePlaylist } from '@/hooks/playlist.hook'
import { formatViews } from '@/lib/utils'
import type { Playlist, PlaylistVideo } from '@/types/playlist.types'
import { createFileRoute } from '@tanstack/react-router'
import { Calendar, Clock, List, VideoIcon, Eye, Edit, TrashIcon } from 'lucide-react'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export const Route = createFileRoute('/playlists/$playlistId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { playlistId } = Route.useParams()
  const { data: playlistVideos, isPending: loadingPlaylist, isError: playlistError } = useGetPlaylistById(playlistId)
  const { mutate: updatePlaylist, isPending: updatingPlaylist } = useUpdatePlaylist()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showDeleteVideoDialog, setShowDeleteVideoDialog] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const playlist: Playlist = playlistVideos ?? {
    _id: playlistId,
    name: '',
    description: '',
    updatedAt: new Date().toISOString(),
    latestVideoThumbnail: '',
    videos: []
  };


  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  useEffect(() => {
    if (playlistVideos?.name) {
      setName(playlistVideos.name)
      setDescription(playlistVideos.description)
    }
  }, [playlistVideos])
  if (loadingPlaylist) return <div>Loading...</div>
  if (playlistError) return <div>Error loading playlist</div>


  console.log("Loaded playlist:", playlist);

  let totalViews = 0, totalDuration = 0
  if (playlist?.videos && playlist?.videos.length > 0) {
    totalViews = playlist.videos.reduce((sum: number, item: PlaylistVideo) => sum + item.video.views, 0) || 0
    totalDuration = playlist.videos.reduce((sum: number, item: PlaylistVideo) => sum + item.video.duration, 0) || 0
  }

  console.log("Total views:", totalViews);
  console.log("Total duration:", formatTotalDuration(totalDuration));

  function formatTotalDuration(totalSeconds: number): string {
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
    if (hours === 0 && minutes === 0) {
      return `${seconds}s`
    }
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  const handleUpdate = () => {
    if (!name.trim() || !description.trim()) {
      console.error("Name and description cannot be empty");
      return;
    }

    if (name === playlist.name && description === playlist.description) {
      toast.warning("No changes found for update")
      return;
    }
    updatePlaylist({ playlistId, name, description });
    setIsEditing(false);
  }
  const openDeleteVideoDialog = (videoId: string) => {
    setSelectedVideoId(videoId);
    setShowDeleteVideoDialog(true);
  };


  return (
    <div className="container mx-auto px-4  max-w-7xl">
      <div className="w-full mb-8">
        <Card className="bg-transparent border-none overflow-hidden py-2 px-4">
          <CardContent className="p-0">
            <div className="flex flex-col lg:flex-row">
              <div className="lg:w-80 w-full flex-shrink-0">
                <div className="relative aspect-video ">
                  <img
                    src={playlist.latestVideoThumbnail || "/placeholder.svg"}
                    alt={playlist.name}
                    className="object-cover rounded-md"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <div className="flex items-center gap-2 text-sm text-orange-300">
                      <List className="w-8 h-8 text-orange-500" />
                      <span className="text-orange-500 text-2xl italic font-semibold">Playlist</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 p-5">
                <div className="space-y-2 transform transition-all duration-300">
                  {isEditing ? (
                    <>
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="text-3xl lg:text-4xl py-6 font-bold border-0 text-white w-full focus-visible:border-0   focus-visible:border-b-2 border-b-2 transition-all duration-300 focus-visible:border-orange-500 focus-visible:ring-0 dark:bg-transparent outline-none rounded-none placeholder:text-orange-800 placeholder:italic resize-none"
                      />
                      <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="text-neutral-300 text-lg w-full break-words font-semibold min-h-10  focus-visible:border-b-2 border-b-2 transition-all duration-300 focus-visible:border-orange-500 placeholder:text-orange-800 placeholder:italic resize-none"
                      />
                      <div className="flex gap-4 pt-2">
                        <Button variant="default" className='bg-orange-500 border-none hover:bg-orange-700 text-white font-semibold transition-all duration-300' onClick={handleUpdate} disabled={updatingPlaylist}>
                          {updatingPlaylist ? 'Updating...' : 'Update'}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setName(playlist.name)
                            setDescription(playlist.description)
                            setIsEditing(false)
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <h1 className="text-3xl lg:text-4xl font-bold text-white">{playlist.name}</h1>
                      <p className="text-neutral-500 text-lg leading-relaxed">{playlist.description}</p>

                      <div className="flex flex-wrap items-center gap-6 pt-4">
                        <div className="flex items-center gap-2 text-orange-400">
                          <List className="w-5 h-5 text-orange-500" />
                          <span className="text-white font-semibold text-lg">Total {playlist.videos.length} videos</span>
                        </div>

                        <div className="flex items-center gap-2 text-orange-400">
                          <Eye className="w-5 h-5 text-orange-500" />
                          <span className="text-white font-semibold text-lg">Overall {formatViews(totalViews)}</span>
                        </div>

                        <div className="flex items-center gap-2 text-orange-400">
                          <Clock className="w-5 h-5 text-orange-500" />
                          <span className="text-white font-semibold text-lg">
                            {formatTotalDuration(totalDuration)} Total duration
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-orange-400">
                          <Calendar className="w-5 h-5 text-orange-500" />
                          <span className="text-white font-semibold">Updated {moment(playlist.updatedAt).fromNow()}</span>
                        </div>
                      </div>

                      <div className="flex gap-5 pt-6  items-end justify-end">
                        <Button title='Edit playlist' variant="default" className='bg-transparent scale-125 border-none hover:bg-neutral-800 transition-all duration-300' onClick={() => setIsEditing(true)}>
                          <Edit className="w-5 h-5 text-orange-600 p-0" />
                        </Button>
                        <Button

                          title='Delete playlist' variant="default" className='bg-transparent scale-125 border-none hover:bg-neutral-800 transition-all duration-300' onClick={() => setShowDeleteDialog(true)}>
                          <TrashIcon className="w-5 h-5 text-red-600" />
                        </Button>
                        <DeletePlaylistDialog
                          open={showDeleteDialog}
                          playlistId={playlistId}
                          onClose={() => setShowDeleteDialog(false)}
                        />
                      </div>
                    </>
                  )}
                </div>

              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Separator className='mb-8 bg-orange-400 py-[1px] w-full' />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-orange-500 flex items-center gap-3">
            <VideoIcon className="w-8 h-8 text-orange-500" />
            Videos
          </h2>

        </div>

        <div className="flex flex-col gap-4">
          {
            playlist?.videos.length === 0 ? (
              <div className="text-center text-gray-500">No videos in this playlist</div>
            ) : (
              playlist?.videos.map((item: PlaylistVideo) => (
                <VideoTile
                  key={item.video._id}
                  video={item.video}
                  addedAt={item.addedAt}
                  playlistOwnerId={playlist.owner}
                  onDelete={() => openDeleteVideoDialog(item.video._id)}
                />
              ))
            )
          }
          {selectedVideoId && (
            <DeleteVideoFromPlaylistDialog
              open={showDeleteVideoDialog}
              playlistId={playlistId}
              videoId={selectedVideoId}
              onClose={() => {
                setShowDeleteVideoDialog(false);
                setSelectedVideoId(null);
              }}
            />
          )}

        </div>
      </div>
    </div>

  )
}
