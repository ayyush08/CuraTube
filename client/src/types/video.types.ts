export interface VideoFetchParams {
    query?: string
    sortBy?: string,
    sortType?: 'desc' | 'asc',
    userId?: string,
    page?: number,
    limit?: number
}


export interface VideoByIdType {
    _id: string,
    videoFile: string,
    thumbnail: string,
    title: string,
    description: string,
    duration: number,
    views: number,
    owner: {
        _id: string,
        username: string,
        fullName: string,
        avatar: string,
        subscribersCount: number,
        isSubscribed: boolean
    },
    createdAt: string,
    likesCount: number,
    isLiked: boolean

}