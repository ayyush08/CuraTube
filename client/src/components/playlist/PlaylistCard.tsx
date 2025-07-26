import type { Playlist } from "@/types/playlist.types"
import { useNavigate } from "@tanstack/react-router"
import { Play } from "lucide-react"
import moment from "moment"

interface PlaylistCardProps {
    playlist: Playlist
}

export function PlaylistCard({ playlist }: PlaylistCardProps) {
    const navigate = useNavigate()

    const handlePlaylistClick = (playlistId: string) => {
        navigate({
            to: `/playlists/${playlistId}`
        })
    }

    const getTotalDuration = () => {
        const totalDuration = playlist.videos.reduce((acc, video) => acc + (video.video.duration || 0), 0)
        if (totalDuration === 0) return "0 sec"
        else if (totalDuration < 60) return `${totalDuration} sec`
        else if (totalDuration < 3600) return `${Math.floor(totalDuration / 60)} mins`
        else return `${Math.floor(totalDuration / 3600)} hrs`
    }

    return (
        <div
            onClick={() => handlePlaylistClick(playlist._id)}
            className="flex flex-col sm:flex-row gap-5 group py-6 px-2.5  transition-all duration-300 rounded-xl hover:cursor-pointer overflow-hidden shadow-md w-full"
        >
            <div className="relative w-full aspect-video rounded-lg">
                <div className="absolute top-4 left-4 w-full h-full bg-orange-500 rounded-lg shadow-xl  scale-[0.95]"></div>
                <div className="absolute top-3  left-3 w-full h-full bg-neutral-600 rounded-lg shadow-md  scale-[0.98]"></div>
                <div className="absolute  top-2 left-2 w-full h-full bg-orange-600 rounded-lg shadow-md  scale-[0.98]"></div>
                <div className="absolute  top-1 left-1 w-full h-full bg-neutral-600 rounded-lg shadow-md  scale-[0.98]"></div>
                <img
                    src={playlist.latestVideoThumbnail || "https://dummyimage.com/640x360/000/fff&text=No+Thumbnail"}
                    alt={playlist.name}
                    className="w-full h-full object-fit rounded-lg relative "
                />

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-lg">
                    <div className="bg-orange-500 rounded-full p-2 shadow-lg">
                        <Play className="w-6 h-6 text-white fill-white" />
                    </div>
                </div>

                <div className="absolute bottom-2 right-2 bg-black/60 font-bold text-white text-sm px-2 py-0.5 rounded-full z-30">
                    {getTotalDuration()}
                </div>
            </div>


            {/* TEXT CONTENT */}
            <div className="flex flex-col justify-between p-4 gap-3 w-full">
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-bold text-white">{playlist.name}</h1>
                    <p className="text-base text-neutral-500 line-clamp-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {playlist.description}
                    </p>
                </div>
                <p className="text-xs text-orange-400 font-semibold italic mt-2">
                    Made {moment(playlist.createdAt).fromNow()}
                </p>
            </div>
        </div>
    )
}
