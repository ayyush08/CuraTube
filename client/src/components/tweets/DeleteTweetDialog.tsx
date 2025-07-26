import { useDeleteTweet } from "@/hooks/tweets.hooks";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";

export const DeleteTweetDialog = ({ open, tweetId, onClose }: { open: boolean, tweetId: string, onClose: () => void }) => {

    const { mutate: deleteTweet, isPending: deletePending } = useDeleteTweet(tweetId);

    const handleDelete = () => {
        console.log('Deleting tweet with ID:', tweetId);
        deleteTweet();
        onClose();
    }

    return (
        <Dialog open={open} onOpenChange={onClose} >

            <DialogContent onInteractOutside={(e) => e.preventDefault()} showCloseButton={false} className="sm:max-w-[450px]   border-orange-400/60 bg-orange-800/20 font-sans z-50 ">
                <DialogHeader>
                    <DialogTitle >Are you sure you want to delete this tweet?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button className='cursor-pointer' disabled={deletePending} variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button className='bg-red-500 hover:bg-red-700 cursor-pointer text-white' onClick={handleDelete} >{
                        deletePending ? "Deleting..." : "Delete"
                    }</Button>
                </DialogFooter>
            </DialogContent>

        </Dialog>
    )
}