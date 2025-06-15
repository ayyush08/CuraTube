import { useAuthGuard } from '@/hooks/helpers/use-auth-guard'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/watch-history/')({
  component: RouteComponent,
})

function RouteComponent() {
  useAuthGuard()
  return <div>Hello "/watch-history/"!</div>
}
