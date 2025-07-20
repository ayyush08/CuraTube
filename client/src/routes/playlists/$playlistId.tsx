import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/playlists/$playlistId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { playlistId } = Route.useParams()
  return <div>Hello "/playlists/{playlistId}"!</div>
}
