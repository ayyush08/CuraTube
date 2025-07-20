import { useNavigate } from "@tanstack/react-router"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import moment from "moment"
import { formatDuration, formatViews } from "@/lib/utils"
import type { Video } from "@/types/video.types"
import { Play } from "lucide-react"
//TODO:Add skeletons

export interface VideoCardProps {
    video: Video
}
export default function VideoCard({ video }: VideoCardProps) {


    const navigate = useNavigate()
    const handleVideoCardClick = (videoId: string) => {
        navigate({ to: `/videos/${videoId}` })
    }

    const handleUsernameClick = (e: React.MouseEvent<HTMLParagraphElement>) => {
        e.stopPropagation();
        navigate({ to: `/channel/${video.owner.username}` });
    }


    return (
        <div onClick={() => handleVideoCardClick(video._id)} className="w-full max-w-sm cursor-pointer group hover:bg-orange-500/20 p-2 mx-auto rounded-lg transition-all duration-300" >
            <div className="relative aspect-video rounded-lg overflow-hidden ">
                <img
                    src={video.thumbnail || "/placeholder.svg"}
                    alt={video.title}
                    className=" object-cover w-full h-full transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center  rounded-lg">
                    <div className="bg-orange-500 rounded-full p-2 shadow-lg">
                        <Play className="w-6 h-6 text-white fill-white" />
                    </div>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/60 font-bold text-white text-sm px-1.5 py-0.5 rounded-full">
                    {formatDuration(video.duration)}
                </div>
            </div>


            <div className="flex gap-3 pt-3">
                <Avatar className="w-10 h-10 flex-shrink-0">
                    <AvatarImage className="object-cover" src={video.owner.avatar || "/placeholder.svg"} alt={video.owner.username} />
                    <AvatarFallback>{video.owner.username.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm line-clamp-2 text-foreground group-hover:text-primary transition-colors">
                        {video.title}
                    </h3>
                    <p onClick={handleUsernameClick} className="text-sm text-muted-foreground mt-1 hover:text-orange-600 transition-colors duration-200">{video.owner.username}</p>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <span>{formatViews(video.views)}</span>
                        <span>•</span>
                        <span>{moment(video.createdAt).fromNow()}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}