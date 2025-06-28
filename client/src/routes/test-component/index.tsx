


import { createFileRoute } from '@tanstack/react-router'



export const Route = createFileRoute('/test-component/')({
  component: RouteComponent,
})



function RouteComponent() {


  
  return (
    <div>
      <h1>Test Component</h1>
    </div>
  )
}



