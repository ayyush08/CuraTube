import { apiClient } from "./api-client";
import { type RegisterRequest,type RegisterResponse } from "@/types/auth.types";

export const register = async (data: RegisterRequest): Promise<RegisterResponse> => {
    try {
        const res = await apiClient.post<RegisterResponse>('/users/register', data);
        return res;
    } catch (error) {
        console.error("Error during registration:", error);
        throw error;
    }
};

