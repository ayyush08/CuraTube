import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/tweets/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/tweets/"!</div>
}
