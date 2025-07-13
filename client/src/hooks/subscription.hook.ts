import { toggleSubscription } from "@/api/subscription.api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";


export const useToggleSubscription = (setIsSubscribed: React.Dispatch<React.SetStateAction<any>>, setSubscriberCount: React.Dispatch<React.SetStateAction<any>>) => {
    return useMutation({
        mutationFn: async (channelId: string) => {
            try {
                const res = await toggleSubscription(channelId)
                
                return res;
            } catch (error: any) {
                toast.error(error);
                throw new Error(error);
            }
        },
        onSuccess: (data) => {
            setIsSubscribed(data?.subscribed)
            setSubscriberCount(data?.subscriberCount)
            if (data?.subscribed) toast.success("Channel Subscribed successfully")
            else toast.success("Channel Unsubscribed successfully")
        },
        onError: (error) => {
            console.error("Mutation error:", error);
        },
    })
}