"use client"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { EditIcon, CheckIcon, XIcon, Trash2Icon, Heart } from "lucide-react"
import {useMemo, useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { useAppSelector } from "@/redux/hooks"
import { useAddComment, useGetVideoComments, useUpdateComment } from "@/hooks/comments.hook"
import type { Comment } from "@/types/comments.types"
import moment from "moment"
import { DeleteCommentDialog } from "./DeleteCommentDialog"
import { useNavigate } from "@tanstack/react-router"
import { useToggleCommentLike } from "@/hooks/likes.hook"



interface CommentSectionProps {
    videoId: string

}

export default function CommentSection({ videoId }: CommentSectionProps) {
    const storedUser = useAppSelector(state => state.auth.user)
    const loadMoreRef = useRef(null);
    const navigate = useNavigate()
    const { data: commentsData, isFetchingNextPage, isLoading, isError: commentError, fetchNextPage, hasNextPage } = useGetVideoComments(videoId, {
        page: 1,
        limit: 10,
        sortBy: 'createdAt',
    });
    
        const [showDeleteDialog, setShowDeleteDialog] = useState(false)
        const [newComment, setNewComment] = useState("")
        const [editingCommentId, setEditingCommentId] = useState<string | null>(null)
        const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null)
        const [editText, setEditText] = useState("")
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
            }
        });

        const currentRef = loadMoreRef.current;

        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);
    const { mutate: addComment, isPending: addingComment, isError: addingCommentError } = useAddComment()
    const { mutate: updateComment, isPending: updatingComment } = useUpdateComment(setEditText,setEditingCommentId)
    const [commentLikeStates, setCommentLikeStates] = useState<Record<string, { isLiked: boolean, likeCount: number }>>({});

    const { mutate: likeComment,isPending: likingComment } = useToggleCommentLike(setCommentLikeStates)
    const comments = useMemo(() => commentsData?.pages.flat() || [], [commentsData]);

    useEffect(() => {
        const initialStates: Record<string, { isLiked: boolean, likeCount: number }> = {};

        comments.forEach((comment: Comment) => {
            const isLiked = comment.likedBy?.some(like => like.likedBy === storedUser?._id) || false;
            const likeCount = comment.likedBy?.length || 0;
            initialStates[comment._id] = { isLiked, likeCount };
        });

        setCommentLikeStates(initialStates);
    }, [comments, storedUser?._id]);


    console.log("Comments Data:", commentsData?.pages[0]);
    if (commentError || addingCommentError) console.error("Error fetching or adding comments:", commentError || addingCommentError);
    const handleSubmitComment = async () => {
        if (!storedUser) {
            toast.error("Please login to post a comment")
            return
        }

        if (!newComment.trim()) {
            toast.error("Comment cannot be empty")
            return
        }
        console.log("Posting new comment:", newComment);
        addComment({ videoId, content: newComment });
        setNewComment("")

    }

    const handleLikeComment = (commentId: string) => {
        if (!storedUser) {
            toast.error("Please login to like comments")
            return
        }
        likeComment(commentId);
    }

    const handleEditComment = (commentId: string, currentText: string) => {
        setEditingCommentId(commentId)
        setEditText(currentText)
    }

    const handleSaveEdit = (commentId: string) => {
        if (!editText.trim()) {
            toast.error("Comment cannot be empty")
            return
        }

        console.log("Editing comment:", commentId, "New text:", editText);

        updateComment({ commentId, content: editText });
    }

    const handleCancelEdit = () => {
        setEditingCommentId(null)
        setEditText("")
    }
    
    if(isLoading) return <div className="flex justify-center items-center min-h-screen">Loading comments...</div>
    return (
        <div className="w-full space-y-6">
            {/* Comment Input */}
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">Comments ({comments.length})</h3>

                {storedUser ? (
                    <div className="space-y-3">
                        <div className="flex gap-3">
                            <Avatar className="w-10 h-10 flex-shrink-0">
                                <AvatarImage src={storedUser.avatar || "/placeholder.svg"} className="object-cover" alt={storedUser.fullName} />
                                <AvatarFallback className="bg-orange-500 text-white">
                                    {storedUser.fullName.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <Textarea
                                    placeholder="Add a comment..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    className="w-full break-words font-semibold min-h-14 text-white focus-visible:border-b-2 border-b-2 transition-all duration-300 focus-visible:border-orange-500 placeholder:text-orange-500/60 placeholder:italic resize-none"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            
                            <Button
                                variant="ghost"
                                title="Cancel comment"
                                onClick={() => setNewComment("")}
                                disabled={addingComment || !newComment.trim()}
                                className="text-neutral-400 hover:text-white hover:bg-neutral-800"
                            >
                                Cancel
                            </Button>
                            <Button
                                title="Post comment"
                                onClick={handleSubmitComment}
                                disabled={addingComment || !newComment.trim()}
                                className={"bg-orange-500 hover:bg-orange-600 text-white"}
                            >
                                {addingComment ? "Posting..." : `Comment`}
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="p-4 bg-neutral-800 rounded-lg text-center">
                        <p className="text-neutral-400">Please login to post a comment</p>
                    </div>
                )}
            </div>
            <div className="space-y-4">
                {comments.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-orange-400">No comments yet. Be the first to comment!</p>
                    </div>
                ) : (
                    comments.map((comment: Comment) => {
                        const isLiked = commentLikeStates[comment._id]?.isLiked || false;

                        return <div key={comment._id} className="bg-orange-700/10 border border-orange-500 rounded-lg p-4 space-y-3">

                            <div className="flex items-start gap-3">
                                <Avatar className="w-10 h-10 flex-shrink-0">
                                    <AvatarImage src={comment.owner.avatar || "/placeholder.svg"} className="object-cover" alt={comment.owner.fullName} />
                                    <AvatarFallback className="bg-orange-500 text-white">
                                        {comment.owner.fullName.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap ">
                                        <span onClick={(e) => {
                                            e.stopPropagation()
                                            navigate({
                                                to: `/channel/${comment.owner.username}`,
                                            })
                                        }} className="font-semibold text-white text-md transition-all duration-300 hover:text-orange-500 cursor-pointer">{comment.owner.fullName}</span>
                                        <span className="text-neutral-500 text-sm">@{comment.owner.username}</span>
                                        <span className="text-neutral-500 text-sm">{moment(comment.updatedAt).fromNow()}</span>
                                    </div>
                                </div>
                                {storedUser?._id === comment.owner._id && (
                                    <>
                                        <Button
                                            title="Edit comment"
                                            variant="default"
                                            size="sm"
                                            onClick={() => handleEditComment(comment._id, comment.comment)}
                                            className="text-neutral-400 hover:bg-orange-500/20 bg-transparent hover:text-orange-500 p-2 h-auto"
                                        >
                                            <EditIcon className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            title="Delete comment"
                                            variant="default"
                                            size="sm"
                                            onClick={() => {
                                                setDeletingCommentId(comment._id);
                                                setShowDeleteDialog(true)
                                            }
                                            }
                                            className="text-neutral-400 bg-transparent hover:bg-red-500/30 hover:text-red-500 p-2 h-auto"
                                        >
                                            <Trash2Icon className="w-4 h-4" />
                                        </Button>
                                        <div ref={loadMoreRef} className="h-10 flex justify-center items-center">
                                            {isFetchingNextPage && <p className="text-orange-500">Loading more...</p>}
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="ml-13">
                                {editingCommentId === comment._id ? (
                                    <div className="space-y-3">
                                        <Textarea
                                            value={editText}
                                            onChange={(e) => setEditText(e.target.value)}
                                            className="w-full text-white min-h-10  focus-visible:border-b-2 border-b-2 transition-all duration-300 focus-visible:border-orange-500 placeholder:text-orange-800 placeholder:italic resize-none"
                                        />
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                onClick={() => handleSaveEdit(comment._id)}
                                                className="bg-orange-500 hover:bg-orange-600 text-white"
                                            >
                                                <CheckIcon className="w-4 h-4 mr-1" />
                                                {updatingComment ? "Saving..." : "Save"}
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={handleCancelEdit}
                                                className="text-neutral-400 hover:text-white hover:bg-neutral-800"
                                            >
                                                <XIcon className="w-4 h-4 mr-1" />
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-orange-400 text-lg font-semibold font-mono leading-relaxed break-words">{comment.comment}</p>

                                        
                                        <div className="flex items-center gap-4 mt-3">
                                            <Button
                                                variant='default'
                                                disabled={likingComment}
                                                onClick={() => handleLikeComment(comment._id)}
                                                className="flex items-center  text-neutral-400 hover:text-orange-500 hover:bg-transparent transition-colors bg-transparent"
                                            >
                                                
                                                <Heart
                                                    
                                                    className={`w-4 h-4  cursor-pointer ${isLiked ? "fill-red-500 text-red-500" : "text-neutral-400"
                                                    }`}
                                                    />
                                                <span className="text-xs">
                                                    
                                                    {commentLikeStates[comment._id]?.likeCount || comment.likedBy?.length || 0}
                                                </span>
                                                
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    }
                    )

                )}
            </div>
            {
                deletingCommentId && (
                    <DeleteCommentDialog
                        open={showDeleteDialog}
                        commentId={deletingCommentId}
                        videoId={videoId}
                        onClose={() => {
                            setShowDeleteDialog(false);
                            setDeletingCommentId(null);
                        }}
                    />
                )
            }
        </div >
    )
}
