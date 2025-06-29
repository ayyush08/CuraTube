import { useAppSelector } from "@/redux/hooks"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { useState } from "react"
import { toast } from "sonner"
import { useCreateTweet } from "@/hooks/tweets.hooks"


const TweetWriter = () => {
    const storedUser = useAppSelector(state => state.auth.user)
    const [tweetContent, setTweetContent] = useState('')

    const { mutate: createTweet, isPending: tweeting, isError: tweetError } = useCreateTweet()
    if (!storedUser) {
        return null
    }

    const handleTweet = () => {
        if (tweetContent.trim()) {
            if (tweetContent.length > 280) {
                toast.error('Tweet exceeds 280 characters limit.')
                return
            }
            createTweet(tweetContent)
            console.log('Tweet posted:', tweetContent)
            setTweetContent('') 
        }
    }

    if (tweetError) {
        toast.error('Failed to post tweet. Please try again.')
        console.error('Error posting tweet:', tweetError)
    }

    return (
        <Card className="bg-transparent rounded-none border-none bor ">
            <CardContent className="p-5">
                <div className="flex gap-6 items-start w-full">
                    <Avatar className="w-16 h-16 border-1 border-orange-200 ">
                        <AvatarImage src={storedUser.avatar} alt="Your avatar" className="object-cover" />
                        <AvatarFallback className="bg-orange-600 text-white">{storedUser.username.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-5 w-full">
                        <Textarea
                            placeholder="Share your thoughts..."
                            value={tweetContent}
                            onChange={(e) => setTweetContent(e.target.value)}
                            className="bg-orange-700/20 break-words border-none w-full md:text-xl p-5 placeholder:text-orange-800 placeholder:italic resize-none focus-visible:ring-2 "
                            rows={3}
                        />
                        <div className="flex items-center justify-end">

                            <div className="flex items-center gap-3">
                                <span className={`text-sm ${tweetContent.length > 280 ? 'text-red-500' : 'text-gray-500'}`}>{280 - tweetContent.length}</span>
                                <Button
                                    onClick={handleTweet}
                                    disabled={!tweetContent.trim()}
                                    className="bg-orange-600 hover:bg-orange-700 text-lg text-white italic cursor-pointer font-semibold px-10 py-5 disabled:opacity-50"
                                >
                                    {tweeting ? 'Please wait...' : 'Tweet'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default TweetWriter