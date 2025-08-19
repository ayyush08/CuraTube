
import { Card, CardContent } from '../ui/card'

const WideSkeleton = ({count}:{
    count: number
}) => {
    return (
        <Card className="bg-transparent border-none">
            <CardContent>
                <div className="space-y-4">
                    {Array.from({ length: count }).map((_, i) => (
                        <div key={i} className="flex items-center space-x-4 animate-pulse">
                            <div className="w-32 h-20 bg-muted rounded"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-muted rounded w-3/4"></div>
                                <div className="h-3 bg-muted rounded w-1/2"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

export default WideSkeleton