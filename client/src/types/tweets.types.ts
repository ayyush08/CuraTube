export interface TweetFetchParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortType?: 'asc' | 'desc';
    userId?: string;
}
