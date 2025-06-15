import { useAuthGuard } from '@/hooks/helpers/use-auth-guard';
import { createFileRoute } from '@tanstack/react-router'


export const Route = createFileRoute('/playlists/')({
  component: RouteComponent,
  
})

function RouteComponent() {

  useAuthGuard('/')
  return <div>Hello "/playlists/"!</div>
}
