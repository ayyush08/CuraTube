
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'
import { Button } from '../ui/button'
import {  EditIcon, Heart, Loader2Icon, TrashIcon } from 'lucide-react'
import { Card, CardContent, CardHeader } from '../ui/card'
import { useEffect, useState } from 'react'
import type { Tweet } from '@/types/tweets.types'
import moment from 'moment'
import { useAppSelector } from '@/redux/hooks'
import { useToggleTweetLike } from '@/hooks/likes.hook'
import { Textarea } from '../ui/textarea'
import { useDeleteTweet, useUpdateTweet } from '@/hooks/tweets.hooks'



const TweetCard = (tweet: Tweet) => {
    const storedUser = useAppSelector((state) => state.auth.user);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [tweetContent, setTweetContent] = useState(tweet.content);

    const { mutate: toggleTweetLike, isPending: likePending } = useToggleTweetLike(setIsLiked, setLikeCount);
    const { mutate: updateTweet, isPending: editPending } = useUpdateTweet(setTweetContent,setIsEditing);
    const { mutate: deleteTweet, isPending: deletePending } = useDeleteTweet(tweet._id);
    useEffect(() => {
        setIsLiked(tweet.likedBy?.some(like => like.likedBy === storedUser?._id) || false);
        setLikeCount(tweet.likedBy?.length || 0);
    }, [tweet.likedBy, storedUser?._id]);

    const handleLike = (tweetId: string) => {
        toggleTweetLike(tweetId);
    }

    const handleSaveEdit = () => {
        if (tweetContent.trim() === '') return;
        console.log('Saving edited tweet:', tweetContent);
        updateTweet({ tweetId: tweet._id, content: tweetContent });
    }

    const handleDelete = () => {
        deleteTweet();
    }

    return (
        <Card className="w-full border-none p-5 rounded-tl-2xl rounded-br-2xl bg-orange-950/50">
            <CardHeader className="p-4 pb-2">
                <div className="flex items-start gap-3">
                    <Avatar className="w-12 h-12">
                        <AvatarImage src={tweet.owner.avatar} alt={tweet.owner.username} className='object-cover' />
                        <AvatarFallback className="bg-orange-600 text-white">{tweet.owner.fullName}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <div className="flex items-center justify-between gap-1">
                            <p className='flex flex-col'>
                                <span className="font-semibold text-white text-xl">{tweet.owner.fullName}</span>
                                <span className="text-gray-500 text-sm">@{tweet.owner.username}</span>
                            </p>
                            <span className="text-orange-500 italic font-semibold text-base">
                                Tweeted {moment(tweet.createdAt).fromNow()}
                            </span>
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="px-4 pb-4">
                {
                    isEditing ? (
                        <div className="space-y-3">
                            <Textarea
                                className="w-full bg-orange-800/20 text-white"
                                value={tweetContent}
                                onChange={(e) => setTweetContent(e.target.value)}
                                rows={3}
                            />
                            <div className="flex gap-3">
                                <Button
                                    size="sm"
                                    onClick={handleSaveEdit}
                                    disabled={editPending}
                                    className="bg-orange-600 hover:bg-orange-700 text-white"
                                >
                                    {editPending ? 'Saving...' : 'Save'}
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={() => {
                                        setTweetContent(tweet.content);
                                        setIsEditing(false);
                                    }}
                                    className="bg-gray-600 hover:bg-gray-700 text-white"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <p className="text-white mb-3 leading-relaxed">{tweet.content}</p>
                            <div className="flex items-center justify-between w-full">
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    disabled={likePending}
                                    onClick={() => handleLike(tweet._id)}
                                    className="flex bg-transparent hover:bg-transparent items-center gap-2 p-2 text-orange-100"
                                >
                                    <Heart className={`w-5 h-5 ${isLiked ? "fill-red-500 text-red-500" : "text-gray-500"}`} />
                                    <span className="text-sm">{likeCount}</span>
                                </Button>

                                {/* Edit button visible only to tweet owner */}
                                {storedUser?._id === tweet.owner._id && (
                                    <div>
                                    <Button
                                        
                                        size="sm"
                                        className="text-orange-500 scale-125 hover:text-orange-200 bg-transparent hover:bg-transparent"
                                        onClick={() => setIsEditing(true)}
                                        >
                                        <EditIcon/>
                                    </Button>
                                    <Button
                                        
                                        size="sm"
                                        className="text-red-500 scale-125 hover:text-red-200 bg-transparent hover:bg-transparent"
                                        onClick={handleDelete}
                                        >
                                        {deletePending ? <Loader2Icon className="animate-spin" /> : <TrashIcon />}
                                    </Button>
                                        </div>

                                )}
                            </div>
                        </div>
                    )
                }
            </CardContent>
        </Card>
    );
};


export default TweetCard