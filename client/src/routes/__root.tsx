import { AppSidebar } from '@/components/AppSidebar';
import { ThemeProvider } from '@/components/theme-provider';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@radix-ui/react-separator';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';


export const Route = createRootRoute({
    
    component: () => (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">

            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                        <div className="flex items-center gap-2 px-4">
                            <SidebarTrigger className="-ml-1" />
                            <Separator orientation="vertical" className="mr-2 h-4" />

                        </div>
                    </header>
                    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                        <Outlet />
                    </div>
                </SidebarInset>
                <TanStackRouterDevtools />
            </SidebarProvider>
        </ThemeProvider>
    ),
});
