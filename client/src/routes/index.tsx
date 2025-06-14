
import { useAppSelector } from '@/redux/hooks';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  const userState = useAppSelector((state)=>state.auth.user)
  console.log(userState);
  return <div className='h-[200vh]' >
    Hello "/"!</div>
}
