import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export default function DeleteDialog({ postId, commentId }: { postId: number, commentId: number }) {
    const handleDeleteComment = async () => {
        try {
            // const res = await deleteComment(postId, commentId);
            // if(!res.ok) return;
            console.log("postId", postId);
            console.log("commentId", commentId);
            alert("success");
        } catch (error) {
            console.log("Error delete comment")
        }
    }
    return (
        <Dialog>
            <DialogTrigger asChild>
                <button
                    className="p-1 rounded-full hover:bg-gray-100 transition"
                >
                    <MoreHorizontal size={18} className="text-gray-400" />
                </button>
            </DialogTrigger>
            <DialogContent className="max-w-sm p-0 rounded-xl overflow-hidden border-0">
                {/* Instagram-like action sheet */}
                <VisuallyHidden>
                    <DialogTitle>Comment actions</DialogTitle>
                </VisuallyHidden>
                <div className="flex flex-col text-center text-sm font-semibold">
                    <DialogClose asChild>
                        <button
                            type="button"
                            className="py-3 text-red-500 hover:bg-gray-50"
                            onClick={() => handleDeleteComment()}
                        >
                            Delete
                        </button>
                    </DialogClose>
                    <div className="h-px bg-gray-200" />
                    <DialogClose asChild>
                        <button type="button" className="py-3 hover:bg-gray-50">
                            Cancel
                        </button>
                    </DialogClose>
                </div>
            </DialogContent>
        </Dialog>
    )
}