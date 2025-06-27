export interface TweetFetchParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortType?: 'asc' | 'desc';
    userId?: string;
}

export interface Tweet {
    _id: string;
    content: string;
    owner: {
        _id: string;
        username: string;
        fullName: string;
        avatar: string;
    };
    createdAt: string;
    updatedAt: string;
    likedBy?: {
        likedBy: string;
    }[];
}
