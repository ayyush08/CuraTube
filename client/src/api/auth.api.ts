import { apiClient } from "./api-client";
import { type ApiSuccessResponse, type LoginRequest, type RegisterRequest } from "@/types/auth.types";

export const register = async (data: RegisterRequest): Promise<any> => {
    try {
        const form = new FormData()
        form.append("fullName", data.fullName)
        form.append("username", data.username)
        form.append("email", data.email)
        form.append("password", data.password)
        if (data.avatar) form.append("avatar", data.avatar)
        if (data.coverImage) form.append("coverImage", data.coverImage)
        const res = await apiClient.post<ApiSuccessResponse>('/users/register', form, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        return res.data;
    } catch (error: any) {
        console.error("Error during registration:", error);
        throw error;
    }
};


export const login = async (data: LoginRequest): Promise<any> => {
    try {
        const res = await apiClient.post<ApiSuccessResponse>('/users/login', data);

        return res.data;
    } catch (error: any) {
        console.error("Error during login:", error);
        throw error.response.data;
    }
}

export const logout = async():Promise<any>=>{
    try {
        const res = await apiClient.post<ApiSuccessResponse>('/users/logout')
        return res.data
    } catch (error:any) {
        console.error("Error during login:", error);
        throw error.response.data;
    }
}