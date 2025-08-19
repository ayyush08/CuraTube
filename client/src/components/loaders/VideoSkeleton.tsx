
import { Card, CardContent } from '../ui/card'

const VideoSkeleton = () => {
    return (
        <div className="animate-pulse space-y-6">
            <div className="w-1/2 aspect-video bg-muted rounded-xl"></div>

            <div className="space-y-3 px-2">
                <div className="h-6 bg-muted rounded w-3/5"></div>
                <div className="h-4 bg-muted rounded w-1/4"></div>
            </div>

            <Card className="w-1/2">
                <CardContent className="p-4 space-y-3">
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                    <div className="h-3 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-2/3"></div>
                </CardContent>
            </Card>

        </div>
    )
}

export default VideoSkeleton