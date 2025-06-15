export interface VideoFetchParams {
    query?: string
    sortBy?: string,
    sortType?: 'desc' | 'asc',
    userId?: string,
    page?: number,
    limit?: number
}
