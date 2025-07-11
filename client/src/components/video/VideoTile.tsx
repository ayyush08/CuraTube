import { formatDuration, formatViews } from '@/lib/utils'
import type { Video } from '@/types/video.types'
import { useNavigate } from '@tanstack/react-router'
import moment from 'moment'

export interface VideoTileProps {
    video: Video
    watchedAt?: string
    likedOn?: string
}

const VideoTile = (
    {
        video,
        watchedAt = '',
        likedOn = ''
    }: VideoTileProps
) => {

    const navigate = useNavigate()

    const handleTileClick = (videoId: string) => {
        navigate({
            to: `/videos/${videoId}`
        })
    }

    const handleOwnerClick = (username: string, e: React.MouseEvent) => {
        e.stopPropagation()
        navigate({
            to: `/channel/${username}`
        })
    }

    return (
        <div onClick={() => handleTileClick(video._id)} className='flex group  flex-col max-w-screen sm:flex-row gap-5 p-3 sm:items-center hover:bg-orange-950/60 transition-all duration-300 rounded-lg hover:cursor-pointer w-full'>
            {/* TODO: Improve Responsiveness */}
            <div className="relative w-full sm:w-96 h-56 rounded-lg overflow-hidden shrink-0 group-hover:scale-95 transition-all duration-150">
                <img
                    src={video.thumbnail || "/placeholder.svg"}
                    alt={video.title}
                    className="object-cover w-full h-full transition-transform "
                />
                <div className="absolute bottom-2 right-2 bg-black/60 font-bold text-white text-sm px-1.5 py-0.5 rounded-full">
                    {formatDuration(video.duration)}
                </div>
            </div>

            <div className="flex flex-col justify-between flex-1 px-1 sm:px-5 py-2 gap-6 w-full">
                <div className='flex flex-col gap-5'>
                    <h1 className='sm:text-2xl text-xl font-extrabold text-white'>{video.title}</h1>
                    <p className=" text-sm sm:text-base text-gray-400 h-10">
                        {video.description.length > 200
                            ? video.description.slice(0, 200) + '...'
                            : video.description}
                    </p>
                    <p className=' text-xs sm:text-sm mt-2 text-neutral-500 font-semibold italic font-mono'>
                        {formatViews(video.views)} | Uploaded {moment(video.createdAt).fromNow()}
                    </p>

                </div>

                <div className="flex   flex-row justify-between items-center sm:items-center gap-3">
                    <div onClick={(e) => handleOwnerClick(video.owner.username, e)} className='flex gap-2 hover:bg-amber-500/10 transition-colors duration-300 hover:cursor-pointer rounded-2xl p-2'>
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
                    {watchedAt && <span className='italic text-orange-400 font-semibold text-sm'>
                        Watched {moment(watchedAt).fromNow()}
                    </span>}
                    {
                        likedOn && <span className='italic text-orange-400 font-semibold text-sm'>
                            You liked it {moment(likedOn).fromNow()}
                        </span>
                    }
                </div>
            </div>
        </div>
    )
}

export default VideoTile