import { PlaylistCard } from '@/components/playlist/PlaylistCard';
import { useAuthGuard } from '@/hooks/helpers/use-auth-guard';
import { useGetUserPlaylists } from '@/hooks/playlist.hook';
import { useAppSelector } from '@/redux/hooks';
import type { Playlist } from '@/types/playlist.types';
import { createFileRoute } from '@tanstack/react-router'


export const Route = createFileRoute('/playlists/')({
  component: RouteComponent,

})

function RouteComponent() {
  useAuthGuard('/')
  const storedUser = useAppSelector((state) => state.auth.user);

  const { data: playlists, isPending: playlistsLoading, isError: playlistsError } = useGetUserPlaylists(storedUser?._id || '');

  if (playlistsError) {
    console.error(playlistsError);
    return <div>Error loading playlists</div>
  }

  if (playlistsLoading) return <div>Loading...</div>;
  console.log(playlists);

  return (
    <div className="">
      <h1 className='text-3xl p-5 font-bold text-center text-orange-600'>All your playlists at one place</h1>
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
        {playlists.map((playlist: Playlist) => (
          <PlaylistCard playlist={playlist} key={playlist._id} />
        ))}
      </div>


    </div>
  )
}
