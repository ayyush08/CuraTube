import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';

type HealthCheckResponse = {
    statusCode: string;
    data: number;
    message: string;
    success:boolean;
};

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

class ApiClient {
    private axiosInstance: AxiosInstance;

    constructor() {
        this.axiosInstance = axios.create({
            baseURL: `${BASE_URL}/api/v1`,
            withCredentials: true,
        });
    }

    async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response = await this.axiosInstance.get<T>(url, config);
            return response.data;
        } catch (error:any) {
            throw error.response.data;
        }
    }

    async post<T, B = any>(url: string, body?: B, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response = await this.axiosInstance.post<T>(url, body, config);
            return response.data;
        } catch (error: any) {
            throw error.response.data;
        }
    }

    async put<T, B = any>(url: string, body?: B, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response = await this.axiosInstance.put<T>(url, body, config);
            return response.data;
        } catch (error:any) {
            throw error.response.data
        }
    }

    async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response = await this.axiosInstance.delete<T>(url, config);
            return response.data;
        } catch (error:any) {
            throw error.response.data
        }
    }

    async healthCheck() {
        return (await this.axiosInstance.get<HealthCheckResponse>('/healthcheck')).data;
    }
}

export const apiClient = new ApiClient(); //singleton instance

