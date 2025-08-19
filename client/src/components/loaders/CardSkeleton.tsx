import { Card, CardContent, CardHeader } from "../ui/card"

const CardSkeleton = ({count}:{
    count: number
}) => {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 ">
            {Array.from({ length: count }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                    <CardHeader className="pb-2">
                        <div className="h-4 bg-muted rounded w-1/2"></div>
                    </CardHeader>
                    <CardContent>
                        <div className="h-8 bg-muted rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-muted rounded w-1/2"></div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

export default CardSkeleton