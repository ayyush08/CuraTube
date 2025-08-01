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
      <div className="p-4 flex flex-wrap gap-6 justify-start">
        {playlists.length === 0 ? (
          <div className="text-center text-xl font-semibold font-mono text-orange-400 w-full">
            No Playlists found. <br/> Create your first playlist to get started!
          </div>
        ) : (
          playlists.map((playlist: Playlist) => (
            <div
              key={playlist._id}
              className="w-full sm:w-[48%] lg:w-[48%] xl:w-[48%]"
            >
              <PlaylistCard playlist={playlist} />
            </div>
          ))
        )}
      </div>



    </div>
  )
}
