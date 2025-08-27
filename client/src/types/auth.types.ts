export interface RegisterRequest {
    username: string;
    fullName: string;
    email: string;
    password: string;
    avatar: File | null;
    coverImage?: File | null;
}



export interface LoginRequest {
    username?: string
    email?: string;
    password: string;
}



interface watchHistoryItem {
    _id: string
    video: string
    watchedAt: string
}

export interface AuthStateUser {
    _id: string
    username: string
    email: string
    fullName: string
    avatar: string
    coverImage: string
    createdAt: string
    updatedAt: string
    watchHistory: watchHistoryItem[]
}

export interface ChangePasswordRequest {
    oldPassword: string,
    newPassword: string
}