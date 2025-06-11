import { AppSidebar } from '@/components/AppSidebar';
import Header from '@/components/Header';
import { ThemeProvider } from '@/components/theme-provider';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';


export const Route = createRootRoute({

    component: () => (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">

            <SidebarProvider>
                <AppSidebar />
                            <SidebarTrigger className="ml-1 mt-2 " />
                    <div className="flex flex-1 flex-col gap-4">
                        <Header/>
                        <Outlet />
                    </div>
                <TanStackRouterDevtools position='bottom-right' />
            </SidebarProvider>
        </ThemeProvider>
    ),
});