
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'
import { Button } from '../ui/button'
import { Heart } from 'lucide-react'
import { Card, CardContent, CardHeader } from '../ui/card'
import { useState } from 'react'
import type { Tweet } from '@/types/tweets.types'
import moment from 'moment'
import { useAppSelector } from '@/redux/hooks'


const TweetCard = (tweet: Tweet) => {
    const storedUser = useAppSelector((state) => state.auth.user);
    const [isLiked, setIsLiked] = useState(false);
    const handleLike = (tweetId: string) => {
        console.log(`Liked tweet with ID: ${tweetId}`);
        setIsLiked(!isLiked);
    }

    return (
        <Card

            className="w-full border-none p-5 rounded-tl-2xl rounded-br-2xl rounded-tr-none rounded-bl-none bg-orange-950/50 transition-colors"
        >
            <CardHeader className="p-4 pb-2">
                <div className="flex items-start gap-3">
                    <Avatar className="w-12 h-12">
                        <AvatarImage src={tweet.owner.avatar} alt={tweet.owner.username} />
                        <AvatarFallback className="bg-orange-600 text-white">
                            {tweet.owner.fullName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <div className="flex  items-center justify-between gap-1">
                            <p className='flex flex-col'>

                                <span className="font-semibold text-white text-xl">{tweet.owner.fullName}</span>
                                <span className="text-gray-500 text-sm">@{tweet.owner.username}</span>
                            </p>
                            <span className="text-orange-500 italic font-semibold text-base">Tweeted  {moment(tweet.updatedAt).fromNow()}</span>
                        </div>
                    </div>

                </div>
            </CardHeader>
            <CardContent className="px-4 pb-4">
                <p className="text-white mb-3 leading-relaxed">{tweet.content} </p>
                <div className="flex items-center justify-between max-w-md">
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleLike(tweet._id)}
                        className={`flex bg-transparent hover:bg-transparent cursor-pointer items-center gap-2 p-2 text-orange-100
                            `}
                    >
                        <Heart className={`w-5 h-5 ${tweet.likedBy?.some(like => like.likedBy === storedUser?._id) ? "fill-red-500 text-red-500" : "text-gray-500"}`} />
                        <span className="text-sm">{tweet.likedBy?.length || 0}</span>
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

export default TweetCard