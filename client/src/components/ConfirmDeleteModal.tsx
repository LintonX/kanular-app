import { useDeleteBoardMutation } from "@/features/api/board-api";
import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { KanbanBoard } from "@/lib/types";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";

export default function ConfirmDeleteModal({boardMetadata}: {boardMetadata: KanbanBoard}) {
  const [deleteBoard, { isError, isLoading, isSuccess }] = useDeleteBoardMutation();
  const [repeatBoardTitle, setRepeatBoardTitle] = useState("");
  const [isMatching, setIsMatching] = useState(true);
  const [keepModalOpen, setKeepModalOpen] = useState(false);

  const matchForDeletion = `DELETE-${boardMetadata.title?.trim().replace(/[^a-zA-Z0-9]/g, '').toUpperCase()}`;

  const handleDeleteBoard = () => {
    console.log(repeatBoardTitle, matchForDeletion)
    if (repeatBoardTitle !== matchForDeletion) {
      setIsMatching(false)
    } else {
      setIsMatching(true)
      deleteBoard(boardMetadata.id!);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setKeepModalOpen(false);
    }
  }, [isSuccess]);

  return (
    <Dialog
      open={keepModalOpen}
      onOpenChange={(open) => {
        if (!isLoading) setKeepModalOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <Button variant={"default"} className="h-7 text-xs w-full">
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[400px] max-w-full p-4">
        <DialogHeader>
          <DialogTitle>Delete Board "{boardMetadata.title}" ?</DialogTitle>
          <DialogDescription>If so, type "{matchForDeletion}" to delete this board. <br/><span className="text-red-500">This action is permanent.</span></DialogDescription>
          <div className="flex flex-col gap-2 mt-2">
            <input
              type="text"
              placeholder={matchForDeletion}
              className="h-9 px-2 outline-1 rounded-sm"
              onChange={(event) => setRepeatBoardTitle(event.target.value)}
            />
            {!isMatching && <span className="text-sm text-red-500 mt-2">To delete this board, please type {<br/>}{matchForDeletion}</span>}
            {isError && (
              <p className="text-sm text-red-500 mt-2">
                Something went wrong. Please try again.
              </p>
            )}
          </div>
        </DialogHeader>
        <div className="flex justify-end">
          <Button
            variant={"default"}
            onClick={handleDeleteBoard}
            disabled={isLoading || isError}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <LoaderCircle className="animate-spin" />
                Deleting...
              </span>
            ) : (
              "Delete"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
