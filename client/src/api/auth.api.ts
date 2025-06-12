import { apiClient } from "./api-client";
import { type ApiSuccessResponse, type LoginRequest,  type RegisterRequest } from "@/types/auth.types";

export const register = async (data: RegisterRequest): Promise<any> => {
    try {
        const res = await apiClient.post<ApiSuccessResponse>('/users/register', data);
        return res.data;
    } catch (error:any) {
        console.error("Error during registration:", error);
        throw error;
    }
};


export const login = async(data:LoginRequest):Promise<any> =>{
    try {
        const res = await apiClient.post<ApiSuccessResponse>('/users/login', data);

        return res.data;
    } catch (error: any) {
        console.error("Error during login:", error);
        throw error.response.data;
    }
}
