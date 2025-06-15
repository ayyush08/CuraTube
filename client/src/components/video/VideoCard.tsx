import { Link } from "@tanstack/react-router"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import moment from "moment"

export interface Video {
    _id: string
    videoFile: string
    thumbnail: string
    title: string
    description: string
    duration: number
    views: number
    isPublished: boolean
    owner: string
    createdAt: string
    updatedAt: string
    ownerDetails: {
        _id: string
        username: string
        avatar: string
    }
}

export interface VideoCardProps {
    video: Video
}

export default function VideoCard({ video }: VideoCardProps) {
    function formatDuration(seconds: number): string {
        const minutes = Math.floor(seconds / 60)
        const remainingSeconds = seconds % 60
        return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
    }

    function formatViews(views: number): string {
        if (views >= 1000000) {
            return `${(views / 1000000).toFixed(1)}M views`
        } else if (views >= 1000) {
            return `${(views / 1000).toFixed(1)}K views`
        }
        return `${views} view${views !== 1 ? "s" : ""}`
    }


    return (
        <Link to='/playlists' className="w-full max-w-sm cursor-pointer group hover:bg-slate-400/10 p-2 rounded-lg transition-all duration-300" >
            <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                <img
                    src={video.thumbnail || "/placeholder.svg"}
                    alt={video.title}
                    className="object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute bottom-2 right-2 bg-black/60 font-bold text-white text-sm px-1.5 py-0.5 rounded-full">
                    {formatDuration(video.duration)}
                </div>
            </div>


            <div className="flex gap-3 pt-3">
                <Avatar className="w-10 h-10 flex-shrink-0">
                    <AvatarImage className="object-cover" src={video.ownerDetails.avatar || "/placeholder.svg"} alt={video.ownerDetails.username} />
                    <AvatarFallback>{video.ownerDetails.username.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm line-clamp-2 text-foreground group-hover:text-primary transition-colors">
                        {video.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">{video.ownerDetails.username}</p>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <span>{formatViews(video.views)}</span>
                        <span>•</span>
                        <span>{moment(video.createdAt).fromNow()}</span>
                    </div>
                </div>
            </div>
        </Link>
    )
}