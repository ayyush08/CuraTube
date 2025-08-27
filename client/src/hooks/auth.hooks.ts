
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { register, login, logout, changePassword } from '@/api/auth.api';
import { type ChangePasswordRequest, type LoginRequest, type RegisterRequest } from '@/types/auth.types';
import { loginSuccess, logout as logoutUser } from '@/redux/authSlice';
import { toast } from 'sonner';
import { useAppDispatch } from '@/redux/hooks';
import { persistor } from '@/redux/store';

export const useRegisterLogin = (onClose: () => void) => {
    const queryClient = useQueryClient();
    const dispatch = useAppDispatch();

    return useMutation({
        mutationFn: async (formData: RegisterRequest) => {
            try {
                // Step 1: Register
                const res = await register(formData);
                console.log("Regres", res);

            } catch (registerError: any) {
                console.log("Register error", registerError);
                toast.error(registerError);
                throw new Error("register-failed"); // Prevent further login attempt
            }

            try {
                // Step 2: Login
                const loginRes = await login({
                    username: formData.username,
                    password: formData.password,
                });
                return loginRes;
            } catch (loginError: any) {
                toast.error(loginError);
                throw new Error("login-failed");
            }
        },

        onSuccess: (data) => {
            console.log("DATA", data);

            dispatch(loginSuccess({ ...data.user }));
            queryClient.invalidateQueries({ queryKey: ['current-user'] });
            queryClient.invalidateQueries({ queryKey: ['video'] });
            toast.success(`Welcome to CuraTube, ${data.user.username}`);
            onClose();
        },

        onError: (error) => {

            console.error("Mutation error:", error);
        },
    });
};


export const useLogin = (onClose: () => void) => {
    const queryClient = useQueryClient()
    const dispatch = useAppDispatch()
    return useMutation({
        mutationFn: async (loginData: LoginRequest) => {
            try {
                const loginRes = await login({ ...loginData });
                return loginRes;
            } catch (error: any) {
                toast.error(error);
                throw new Error("login-failed");
            }
        },
        onSuccess: (data) => {
            dispatch(loginSuccess({ ...data.user }));
            queryClient.invalidateQueries({ queryKey: ['current-user'] });
            queryClient.invalidateQueries({ queryKey: ['video'] })
            toast.success(`Welcome, ${data.user.username}`);
            onClose();
        },
        onError: (error) => {

            console.error("Mutation error:", error);
        },
    })
}


export const useLogout = (onClose: () => void) => {
    const queryClient = useQueryClient()
    const dispatch = useAppDispatch()
    return useMutation({
        mutationFn: async () => {
            try {
                await logout();
            } catch (error: any) {
                toast.error(error);
                throw new Error("logout-failed");
            }
        },
        onSuccess: () => {
            dispatch(logoutUser())
            persistor.purge()

            queryClient.invalidateQueries()

            toast.dismiss("Logged out")
            onClose()
        },
        onError: (error) => {

            console.error("Mutation error:", error);
        },
    })
}

export const useChangePassword = (onClose: () => void) => {
    return useMutation({
        mutationFn: (data: ChangePasswordRequest) => changePassword(data),
        onSuccess: (data) => {
            console.log("Password changed successfully:", data);
            toast.success("Password changed successfully");
            onClose();
        },
        onError: (error: any) => {
            toast.error(error);
            console.error("Mutation error:", error);
        },
    })
}