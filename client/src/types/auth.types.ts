export interface RegisterRequest  {
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

export interface ApiSuccessResponse {
    statusCode: string;
    data: number;
    message: string;
    success: boolean;
}