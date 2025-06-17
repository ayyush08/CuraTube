import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/public-profile/$userId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { userId } = Route.useParams()

  return <div>Hello "/public-profile/${userId}"!</div>
}
