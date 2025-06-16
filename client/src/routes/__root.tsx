import { AppSidebar } from '@/components/AppSidebar';
import Header from '@/components/Header';
import { ThemeProvider } from '@/components/theme-provider';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/sonner';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export const Route = createRootRoute({

    component: RootLayout
});


export function RootLayout() {
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
