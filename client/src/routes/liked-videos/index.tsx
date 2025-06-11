import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/liked-videos/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/liked-videos/"!</div>
}
