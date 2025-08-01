import type { Playlist } from '@/types/playlist.types';
import { PlaylistCard } from '../playlist/PlaylistCard';
import { useGetUserPlaylists } from '@/hooks/playlist.hook';


const Playlists = ({ userId }: { userId: string | undefined }) => {

    const { data: playlists, isPending: playlistsLoading, isError: playlistsError } = useGetUserPlaylists(userId || '');

    if (playlistsError) {
        console.error(playlistsError);
        return <div>Error loading playlists</div>
    }

    if (playlistsLoading) return <div>Loading...</div>;
    console.log(playlists);


    return (
        <div className="">
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

export default Playlists