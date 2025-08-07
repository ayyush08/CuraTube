import { AppSidebar } from '@/components/AppSidebar';
import Header from '@/components/Header';
import { ThemeProvider } from '@/components/theme-provider';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/sonner';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useCheckServer } from '@/hooks/helpers/useCheckServer';
import LoadServer from '@/components/loaders/LoadServer';
import { useEffect } from 'react';

export const Route = createRootRoute({

    component: RootLayout
});


export function RootLayout() {
    const { data, isLoading, isError,isSuccess } = useCheckServer();
    useEffect(() => {
        if (isSuccess) {
            sessionStorage.setItem('serverReady', 'true');
        }
    }, [isSuccess]);
    if (isLoading) {
        return <div className="flex justify-center items-center min-h-screen bg-black flex-col gap-10">
            <LoadServer />
            <p className="text-orange-500 text-3xl font-bold font-mono">Checking if server is running...</p>
        </div>;
    }
    if (isError || !sessionStorage.getItem('serverReady')) {
        console.error("Server is down or unreachable:", data);
        return <div className="flex justify-center text-red-500 text-2xl items-center min-h-screen">Server is down or unreachable.</div>;
    }

    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <SidebarProvider>
                <AppSidebar />
                <div className="flex flex-1 flex-col ">
                    <Header />
                    <Toaster closeButton position="top-center" richColors />
                    <Outlet />
                </div>
                <TanStackRouterDevtools position="bottom-right" />
                <ReactQueryDevtools initialIsOpen={false} buttonPosition='bottom-left' />
            </SidebarProvider>
        </ThemeProvider>
    );
}
