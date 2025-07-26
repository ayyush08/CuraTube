"use client"

import { useEffect, useState } from "react"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Check } from "lucide-react"
import { toast } from "sonner"
import { useAddVideoToPlaylist, useCreatePlaylist, useGetUserPlaylists } from "@/hooks/playlist.hook"
import { useAppSelector } from "@/redux/hooks"
import type { Playlist } from "@/types/playlist.types"

const PlaylistDialog = ({ videoId, open, onClose }: { videoId: string, open: boolean, onClose: () => void }) => {

    const storedUser = useAppSelector((state) => state.auth.user)
    const [selectedPlaylistIds, setSelectedPlaylistIds] = useState<string[]>([])
    const [newPlaylistName, setNewPlaylistName] = useState("")
    const [newPlaylistDescription, setNewPlaylistDescription] = useState("")

    const { data: playlists, isPending: playlistsLoading } = useGetUserPlaylists(storedUser?._id || '')
    const { mutate: addVideoToPlaylist, isPending: addingVideo } = useAddVideoToPlaylist()

    const { mutate: createPlaylist, isPending: creatingPlaylist } = useCreatePlaylist()
    useEffect(() => {
        if (!open) {
            setSelectedPlaylistIds([])
            setNewPlaylistName("")
            setNewPlaylistDescription("")
        }
    }, [open])

    if (playlistsLoading) {
        return <div className="text-white">Loading playlists...</div>
    }
    console.log("Playlists data:", playlists);

    let userPlaylists: Playlist[] = []
    if (Array.isArray(playlists)) userPlaylists = playlists

    const handleAddToExistingPlaylist = async () => {
        if (selectedPlaylistIds.length === 0) {
            toast.warning("Please select at least one playlist to add the video to.")
            return
        }

        selectedPlaylistIds.forEach((playlistId) => {
            addVideoToPlaylist({ playlistId, videoId })
        })
        toast.success(`Added to ${selectedPlaylistIds.length} playlist${selectedPlaylistIds.length > 1 ? 's' : ''}.`)
        setSelectedPlaylistIds([])
    }

    const handleCreateNewPlaylist = async () => {
        if (!newPlaylistName.trim()) {
            toast.warning("Please enter a playlist name.")
            return
        }

        createPlaylist({
            name: newPlaylistName,
            description: newPlaylistDescription
            , videoId: videoId || ""
        })


        setNewPlaylistName("")
        setNewPlaylistDescription("")
    }


    return (
        <div className="flex  items-center justify-center bg-black ">
            <Dialog
                open={open}
                onOpenChange={onClose}
            >
                <DialogContent
                    showCloseButton={false}
                    onInteractOutside={(e) => e.preventDefault()}
                    className="bg-black border-orange-500 mx-auto  text-white w-full max-w-5xl sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl rounded-lg p-10 sm:p-6 overflow-y-auto max-h-[90vh]"
                >

                    <DialogHeader>
                        <DialogTitle className="text-center text-xl font-bold text-orange-500">Add to Playlist</DialogTitle>
                        <DialogDescription className="text-center text-base text-orange-300">
                            Choose playlists to add this video to or create a new one
                        </DialogDescription>
                    </DialogHeader>

                    <Tabs defaultValue="existing" className="w-full transition-all duration-150">
                        <TabsList className="flex mx-auto w-fit gap-4 bg-black  border-orange-500/50 border-2 transition-all duration-300 py-5">
                            <TabsTrigger
                                value="existing"
                                className="data-[state=active]:bg-orange-500 data-[state=active]:text-black p-4"
                            >
                                Existing Playlist
                            </TabsTrigger>
                            <TabsTrigger value="new" className="data-[state=active]:bg-orange-500 data-[state=active]:text-black p-4">
                                Create New
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="existing" className="space-y-4 mt-6 w-full">
                            <div className="space-y-2 flex flex-wrap justify-start gap-4">
                                {userPlaylists.length === 0 ? (
                                    <div className="text-center w-full mx-auto text-sm text-orange-300">
                                        You don't have any playlists yet.
                                    </div>
                                ):
                                (
                                    userPlaylists.map((playlist: Playlist) => (
                                        <div key={playlist._id} className="flex items-center w-full sm:w-[48%] md:w-[31%] space-x-3">
                                            <Checkbox
                                            id={playlist._id}
                                            checked={selectedPlaylistIds.includes(playlist._id)}
                                            disabled={playlist.videos.some(video => video.video._id === videoId)}
                                            onCheckedChange={(checked) => {
                                                if (checked && !selectedPlaylistIds.includes(playlist._id)) {
                                                    setSelectedPlaylistIds([...selectedPlaylistIds, playlist._id])
                                                } else {
                                                    setSelectedPlaylistIds(selectedPlaylistIds.filter((id) => id !== playlist._id))
                                                }
                                            }}
                                            className="border-orange-500 hidden data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                                        />
                                        <Label
                                            htmlFor={playlist._id}
                                            className={`flex-1 cursor-pointer  min-h-[120px]  rounded-lg border border-orange-500/30 hover:border-orange-500 hover:bg-orange-500/10 ${selectedPlaylistIds.includes(playlist._id) ? 'bg-orange-500/10' : ''} transition-colors`}
                                        >
                                            <div className="flex justify-between w-full p-5 items-center">
                                                {
                                                    playlist.videos.some(video => video.video._id === videoId) ? (
                                                        <>
                                                            <p className="font-medium text-white">{playlist.name}
                                                                <br />
                                                                <span className="text-orange-300 text-sm text-ellipsis overflow-hidden">
                                                                    {playlist.description.length > 15 ? `${playlist.description.slice(0, 15)}...` : playlist.description}
                                                                </span>
                                                            </p>
                                                            <span className="text-green-500 text-xs italic font-semibold">
                                                                Already added
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <p className="font-medium text-white">{playlist.name}
                                                                <br />
                                                                <span className="text-orange-300  text-sm">
                                                                    {playlist.description.length > 15 ? `${playlist.description.slice(0, 15)}...` : playlist.description}
                                                                </span>
                                                            </p>
                                                        </>
                                                    )
                                                }
                                                <span className="text-sm text-orange-300">{playlist.videos.length} {playlist.videos.length === 1 ? "video" : "videos"}</span>
                                            </div>
                                        </Label>
                                    </div>
                                )))}
                            </div>

                            <DialogFooter className="gap-2 mt-6">
                                <DialogClose asChild>
                                    <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent">
                                        Close
                                    </Button>
                                </DialogClose>
                                <Button
                                    onClick={handleAddToExistingPlaylist}
                                    disabled={addingVideo || selectedPlaylistIds.length === 0}
                                    className="bg-orange-500 hover:bg-orange-600 text-black font-medium"
                                >
                                    {addingVideo ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2" />
                                            Adding...
                                        </>
                                    ) : (
                                        <>
                                            <Check className="mr-2 h-4 w-4" />
                                            Add to {selectedPlaylistIds.length > 0 ? `${selectedPlaylistIds.length} ` : ""}Playlist
                                            {selectedPlaylistIds.length !== 1 ? "s" : ""}
                                        </>
                                    )}
                                </Button>
                            </DialogFooter>
                        </TabsContent>

                        <TabsContent value="new" className="space-y-4 mt-6 w-1/2 mx-auto">
                            <div className="space-y-2">
                                <Label htmlFor="playlist-name" className="text-orange-300">
                                    Playlist Name
                                </Label>
                                <Input
                                    id="playlist-name"
                                    placeholder="Enter playlist name..."
                                    value={newPlaylistName}
                                    onChange={(e) => setNewPlaylistName(e.target.value)}
                                    className="bg-gray-900 border-orange-500/30 text-white placeholder:text-gray-500 focus:border-orange-500"
                                />
                                <Label htmlFor="playlist-description" className="text-orange-300">
                                    Playlist Description
                                </Label>
                                <Input
                                    id="playlist-description"
                                    placeholder="Enter playlist description..."
                                    value={newPlaylistDescription}
                                    onChange={(e) => setNewPlaylistDescription(e.target.value)}
                                    className="bg-gray-900 border-orange-500/30 text-white placeholder:text-gray-500 focus:border-orange-500"
                                />
                            </div>

                            <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/30">
                                <div className="flex items-center gap-2 text-orange-300">
                                    <Plus className="h-4 w-4" />
                                    <span className="text-sm">This will create a new playlist and add the current video to it.</span>
                                </div>
                            </div>

                            <DialogFooter className="gap-2 mt-6">
                                <DialogClose asChild>
                                    <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent">
                                        Cancel
                                    </Button>
                                </DialogClose>
                                <Button
                                    onClick={handleCreateNewPlaylist}
                                    disabled={creatingPlaylist || !newPlaylistName.trim()}
                                    className="bg-orange-500 hover:bg-orange-600 text-black font-medium"
                                >
                                    {creatingPlaylist ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2" />
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="mr-2 h-4 w-4" />
                                            Create & Add
                                        </>
                                    )}
                                </Button>
                            </DialogFooter>
                        </TabsContent>
                    </Tabs>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default PlaylistDialog


