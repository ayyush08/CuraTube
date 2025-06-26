import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosError } from 'axios';
import { logout } from '../redux/authSlice';
import { store } from '@/redux/store';

type HealthCheckResponse = {
    statusCode: string;
    data: number;
    message: string;
    success: boolean;
};

export interface ApiSuccessResponse {
    statusCode: string;
    data: number;
    message: string;
    success: boolean;
}

interface RefreshTokenResponse {
    statusCode: number;
    data: {
        accessToken: string;
        refreshToken: string;
    };
    message: string;
    success: boolean;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

class ApiClient {
    private axiosInstance: AxiosInstance;
    private isRefreshing = false;
    private failedQueue: Array<{
        resolve: (value?: any) => void;
        reject: (error?: any) => void;
    }> = [];

    constructor() {
        this.axiosInstance = axios.create({
            baseURL: `${BASE_URL}/api/v1`,
            withCredentials: true,
        });

        this.setupInterceptors();
    }

    private setupInterceptors() {
        this.axiosInstance.interceptors.response.use(
            (response) => response,
            async (error: AxiosError) => {
                const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };


                if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/users/refresh-token')) {
                    if (this.isRefreshing) {
                        // If already refreshing, queue the request
                        return new Promise((resolve, reject) => {
                            this.failedQueue.push({ resolve, reject });
                        }).then(() => {
                            return this.axiosInstance(originalRequest);
                        }).catch(err => {
                            return Promise.reject(err);
                        });
                    }

                    originalRequest._retry = true;
                    this.isRefreshing = true;

                    try {

                        const response = await this.axiosInstance.post<RefreshTokenResponse>('/users/refresh-token');
                        console.log("Refresh token response", response);

                        if (response.data.success) {

                            this.processQueue(null);


                            return this.axiosInstance(originalRequest);
                        }
                    } catch (refreshError) {

                        this.processQueue(refreshError);
                        console.log("Refresh token failed", refreshError);

                        store.dispatch(logout());


                        return Promise.reject(refreshError);
                    } finally {
                        this.isRefreshing = false;
                    }
                }

                return Promise.reject(error);
            }
        );
    }

    private processQueue(error: any) {
        console.log("Processing failed queue", this.failedQueue);

        this.failedQueue.forEach(({ resolve, reject }) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });

        this.failedQueue = [];
    }

    async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response = await this.axiosInstance.get<T>(url, config);
            return response.data;
        } catch (error: any) {
            throw error.response?.data || error;
        }
    }

    async post<T, B = any>(url: string, body?: B, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response = await this.axiosInstance.post<T>(url, body, config);
            return response.data;
        } catch (error: any) {
            throw error.response?.data || error;
        }
    }

    async put<T, B = any>(url: string, body?: B, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response = await this.axiosInstance.put<T>(url, body, config);
            return response.data;
        } catch (error: any) {
            throw error.response?.data || error;
        }
    }

    async patch<T, B = any>(url: string, body?: B, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response = await this.axiosInstance.patch<T>(url, body, config);
            return response.data;
        } catch (error: any) {
            throw error.response?.data || error;
        }
    }

    async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response = await this.axiosInstance.delete<T>(url, config);
            return response.data;
        } catch (error: any) {
            throw error.response?.data || error;
        }
    }

    async healthCheck() {
        return (await this.axiosInstance.get<HealthCheckResponse>('/healthcheck')).data;
    }
}

export const apiClient = new ApiClient();