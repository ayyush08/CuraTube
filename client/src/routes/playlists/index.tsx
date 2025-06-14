import { store } from '@/redux/store';
import { createFileRoute, redirect } from '@tanstack/react-router'
import { toast } from 'sonner';

export const Route = createFileRoute('/playlists/')({
  component: RouteComponent,
  beforeLoad: () => {
    const isAuthed = store.getState().auth.isAuthenticated;
    if (!isAuthed) {
      toast.error('Pleas log in');
      throw redirect({
        to: '/',
      })
      
    }
  }
})

function RouteComponent() {
  return <div>Hello "/playlists/"!</div>
}
