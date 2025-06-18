export interface UserChannelProfile {
    _id: string;
    username: string;
    fullName: string;
    email: string;
    avatar: string;
    coverImage: string;
    createdAt: string;
    subscribers: number;
    channelsSubscribed: number;
    isSubscribed:boolean;
}