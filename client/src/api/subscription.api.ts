import { apiClient, type ApiSuccessResponse } from "./api-client";

export const toggleSubscription = async (channelId: string): Promise<any> => {
    try {
        const res = await apiClient.post<ApiSuccessResponse>(`/subscriptions/c/${channelId}`);
        return res.data;
    } catch (error) {
        console.error("Error toggling subscription:", error);
        throw error;
    }
}