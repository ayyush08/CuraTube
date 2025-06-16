import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/videos/publish/')({
    component: RouteComponent,
})

function RouteComponent() {
    return <div>Hello "/videos/publish/"!</div>
}
