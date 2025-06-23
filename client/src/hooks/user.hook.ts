import { getUserChannelProfile, getUserWatchHistory, updateUserCoverImage, updateUserProfileImage } from "@/api/user.api"
import { updateUser } from "@/redux/authSlice"
import { useAppDispatch } from "@/redux/hooks"
import type { UserChannelProfile } from "@/types/user.type"
import { useMutation, useQuery } from "@tanstack/react-query"
import { toast } from "sonner"

export const useWatchHistory = () => {
    return useQuery({
        queryKey: ['watch-history'],
        queryFn: () => getUserWatchHistory(),
        staleTime: 1000 * 60 * 5,
    })
}

export const useUserChannelProfile = (username: string, subscriberId: string) => {
    return useQuery<UserChannelProfile>({
        queryKey: ['user-channel-profile', username, subscriberId],
        queryFn: () => getUserChannelProfile(username, subscriberId),
        staleTime: 1000 * 60 * 5,
        enabled: !!username, // Only run the query if username is provided
    })
}

export const useUpdateUserProfileImage = (setAvatar: React.Dispatch<React.SetStateAction<string | undefined>>) => {
    const dispatch = useAppDispatch()
    return useMutation({
        mutationFn: (formData: FormData) => updateUserProfileImage(formData),
        onSuccess: (data) => {
            console.log("Profile image updated successfully", data);
            setAvatar(data.avatar);
            dispatch(updateUser({
                avatar: data.avatar,
                
            }));
            toast.success("Profile image updated successfully");
        },
        onError: (error) => {
            console.error("Error updating profile image:", error);
        },
    })
}

export const useUpdateUserCoverImage = (setCoverImage: React.Dispatch<React.SetStateAction<string | undefined>>) => {
    const dispatch = useAppDispatch()
    return useMutation({
        mutationFn: (formData: FormData) => updateUserCoverImage(formData),
        onSuccess: (data) => {
            console.log("Cover image updated successfully", data);
            setCoverImage(data.coverImage);
            dispatch(updateUser({
                coverImage: data.coverImage,
            }));
            toast.success("Cover image updated successfully");
        },
        onError: (error) => {
            console.error("Error updating cover image:", error);
        },
    })
}