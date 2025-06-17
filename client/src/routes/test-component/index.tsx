
import { formatDuration, formatViews } from '@/lib/utils'
import { createFileRoute } from '@tanstack/react-router'
import moment from 'moment'

export const Route = createFileRoute('/test-component/')({
  component: RouteComponent,
})

const video = {
  _id: "6823437e899272bcb7c33e33",
  videoFile: "https://ik.imagekit.io/lmpthl5suv/curatube-videos/public_temp_mylivewallpapers-com-Red-Rings-Itachi-4K_iq7t_cTM1x.mp4",
  thumbnail: "https://ik.imagekit.io/lmpthl5suv/curatube-thumbnails/public_temp_IMG_20250126_010524_406_LMT6vk-Ky1.jpg",
  title: "devVideo",
  description: "devdescriptiondevdescriptiondevdescriptiondevdescriptiondevdescriptiondevdescriptiondevdescriptiondevdescriptiondevdescriptiondevdescriptiondevdescriptiondevdescriptiondevdescriptiondevdescriptiondevdescriptiondevdescriptiondevdescriptiondevdescriptiondevdescriptiondevdescriptiondevdescriptiondevdescriptiondevdescriptiondevdescription",
  duration: 13,
  views: 1,
  isPublished: true,
  owner: {
    _id: "682005492c0eb1faea841fec",
    username: "ayyushtester2",
    fullName: "Curator",
    avatar: "https://ik.imagekit.io/lmpthl5suv/curatube-user-avatars/public_temp_IMG_20250501_084434_993_YBbtj4F0lH.jpg"
  },
  "createdAt": "2025-05-13T13:05:02.359Z",
  "updatedAt": "2025-05-13T18:06:37.584Z",
  "__v": 0
}

function RouteComponent() {
  return <div className='flex flex-col max-w-screen sm:flex-row gap-5 p-5 sm:items-center hover:bg-orange-950/60 transition-all duration-300 rounded-lg hover:cursor-pointer w-full'>
    {/* TODO: Improve Responsiveness */}
    <div className="relative w-full sm:w-72 h-56 rounded-lg overflow-hidden shrink-0">
      <img
        src={video.thumbnail || "/placeholder.svg"}
        alt={video.title}
        className="object-cover w-full h-full transition-transform group-hover:scale-105"
      />
      <div className="absolute bottom-2 right-2 bg-black/60 font-bold text-white text-sm px-1.5 py-0.5 rounded-full">
        {formatDuration(video.duration)}
      </div>
    </div>

    {/* Details */}
    <div className="flex flex-col justify-between flex-1 px-1 sm:px-5 py-2 gap-6 w-full">
      {/* Title + Description + Uploaded */}
      <div>
        <h1 className='sm:text-2xl text-xl font-extrabold text-white'>{video.title}</h1>
        <p className=" text-sm sm:text-base text-gray-400 ">
          {video.description.length > 100
            ? video.description.slice(0, 100) + '...'
            : video.description}
        </p>
        <p className=' text-xs sm:text-sm mt-2 text-neutral-500 font-mono'>
          {formatViews(video.views)} | Uploaded {moment(video.createdAt).fromNow()}
        </p>

      </div>

      <div className="flex   flex-row justify-between items-center sm:items-center gap-3">
        <div className='flex gap-2 hover:bg-amber-500/10 transition-colors duration-300 hover:cursor-pointer rounded-2xl p-2'>
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
        <span className='italic text-orange-400 text-sm'>
          Watched {moment(video.updatedAt).fromNow()}
        </span>
      </div>
    </div>
  </div>

}



