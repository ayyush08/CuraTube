export interface CommentFetchParams {
    page: number;
    limit: number;
    sortBy?: string; 
}


export interface Comment {
    _id: string;
    comment: string;
    createdAt: string;
    updatedAt: string;
    owner:{
        avatar: string;
        username: string;
        fullName: string;
        _id: string;
    },
    likedBy?: {
        likedBy: string;
    }[];
}