import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/api-client'; 


export const useCheckServer = () => {
    const serverRunning = sessionStorage.getItem('serverReady') === 'true';
    return useQuery({
        queryKey: ['healthcheck'],
        queryFn: () => apiClient.healthCheck(),
        enabled: !serverRunning, // Only run if server is not ready
        retry: false, // avoids retrying if server is booting up
        refetchOnWindowFocus: false,
        refetchInterval: 3000
    });
};
