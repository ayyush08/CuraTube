import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/test-component/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>
    Testing area
  </div>  
}
