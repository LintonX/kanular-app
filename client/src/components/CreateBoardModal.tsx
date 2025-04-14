import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { useCreateNewPrimaryBoardMutation } from "@/features/api/board-api";
import { LoaderCircle } from "lucide-react";

export default function CreateTaskModal() {
  const [createNewPrimaryBoard, { isError, isLoading, isSuccess }] =
    useCreateNewPrimaryBoardMutation();
  const [boardTitle, setBoardTitle] = useState("");
  const [keepModalOpen, setKeepModalOpen] = useState(false);

  const handleCreateBoard = () => {
    if (!boardTitle.trim() || !boardTitle.trim()) return;
    createNewPrimaryBoard( boardTitle );
  };

  useEffect(() => {
    if (isSuccess) {
      setBoardTitle("");
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
        <Button variant={"default"} className="flex w-full h-full bg-none">
          + Create Board
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[350px] max-w-full p-4">
        <DialogHeader>
          <DialogTitle>Create A New Board</DialogTitle>
          <div className="flex flex-col gap-2 mt-2">
            <input
              type="text"
              placeholder={"Name Board ex. 'Product Research'"}
              className="h-9 px-2 outline-1 rounded-sm"
              onChange={(event) => setBoardTitle(event.target.value)}
            />
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
            onClick={handleCreateBoard}
            disabled={isLoading || isError}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <LoaderCircle className="animate-spin" />
                Creating...
              </span>
            ) : (
              "Create"
            )}
          </Button>
        </div>
        <DialogDescription />
      </DialogContent>
    </Dialog>
  );
}
