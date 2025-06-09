export type RegisterRequest = {
    username: string;
    fullName: string;
    email: string;
    password: string;
    avatar?: File;    
    coverImage?: File;
}

export type RegisterResponse = {
    _id: string;
    username: string;
    email: string;
    fullName: string;
    avatar: string;
    coverImage: string;
    watchHistory: string[];
    createdAt: string;
    updatedAt: string;
}