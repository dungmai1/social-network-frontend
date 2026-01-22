import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MoreHorizontal } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface CommentOptionsDialogProps {
  postId: number;
  commentId: number;
  canEdit: boolean;
  canDelete: boolean;
  onDelete: (postId: number, commentId: number) => void;
  onEditClick: () => void;
}

export default function DeleteDialog({
  postId,
  commentId,
  canEdit,
  canDelete,
  onDelete,
  onEditClick,
}: CommentOptionsDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="p-1 rounded-full hover:bg-gray-100 transition">
          <MoreHorizontal size={18} className="text-gray-400" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-sm p-0 rounded-xl overflow-hidden border-0">
        {/* Instagram-like action sheet */}
        <VisuallyHidden>
          <DialogTitle>Comment actions</DialogTitle>
        </VisuallyHidden>
        <div className="flex flex-col text-center text-sm font-semibold">
          {canEdit && (
            <>
              <DialogClose asChild>
                <button
                  type="button"
                  className="py-3 text-blue-500 hover:bg-gray-50"
                  onClick={onEditClick}
                >
                  Edit
                </button>
              </DialogClose>
              <div className="h-px bg-gray-200" />
            </>
          )}
          {canDelete && (
            <>
              <DialogClose asChild>
                <button
                  type="button"
                  className="py-3 text-red-500 hover:bg-gray-50"
                  onClick={() => onDelete(postId, commentId)}
                >
                  Delete
                </button>
              </DialogClose>
              <div className="h-px bg-gray-200" />
            </>
          )}
          <DialogClose asChild>
            <button type="button" className="py-3 hover:bg-gray-50">
              Cancel
            </button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
