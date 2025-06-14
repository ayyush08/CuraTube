import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner'; 
import { useAppSelector } from '@/redux/hooks'; 

export function useAuthGuard(redirectTo: string = '/') {
    const navigate = useNavigate();
    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

    useEffect(() => {
        if (!isAuthenticated) {
            toast.error('You must be logged in to access this page.');
            navigate({ to: redirectTo });
        }
    }, [isAuthenticated, navigate, redirectTo]);
}
