"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { Eye, Heart, Video, UserPlus, History, MessageSquareIcon } from "lucide-react"

interface Stat {
    title: string
    description: string
    value: number
    type: "video" | "view" | "like" | "subscriber" | "watch" | "comment"
}

interface AnalyticsProps {
    stats: Stat[],
    loading: boolean
}

const statIconMap = {
    video: Video,
    view: Eye,
    like: Heart,
    subscriber: UserPlus,
    watch: History,
    comment: MessageSquareIcon,
}
export function Analytics({
    stats,
    loading
}: AnalyticsProps) {







    if (loading) {
        return (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
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

    if (!stats) return null



    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {stats.map((card) => {
                const Icon = statIconMap[card.type]

                return <Card key={card.title} className="border-l-4 border-l-orange-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-lg font-medium text-white">{card.title}</CardTitle>
                        <>
                            {Icon && <Icon className="h-5 w-5 text-orange-500" />}
                        </>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">{card.value}</div>
                        <CardDescription className="text-sm text-muted-foreground">{card.description}</CardDescription>

                    </CardContent>
                </Card>
            }
            )}
        </div>
    )
}
