import { useDeleteTaskMutation } from "@/features/api/board-api";
import { LoaderCircle, Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { KanbanCard } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useDispatch } from "react-redux";
import { lazyDeleteTask } from "@/features/slice/userSession/userSessionSlice";

export default function ConfirmDeleteTaskModal({
  taskData,
}: {
  taskData: KanbanCard;
}) {
  const dispatch = useDispatch();
  const [deleteTask, { isError, isLoading, isSuccess }] =
    useDeleteTaskMutation();
  const [repeatTaskTitle, setRepeatTaskTitle] = useState("");
  const [isMatching, setIsMatching] = useState(true);
  const [keepModalOpen, setKeepModalOpen] = useState(false);

  const matchForDeletion = `DELETE-${taskData.title
    ?.trim()
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase()}`;

  const handleDeleteTask = async () => {
    if (isLoading) return;
    console.log(repeatTaskTitle, matchForDeletion);
    if (repeatTaskTitle !== matchForDeletion) {
      setIsMatching(false);
    } else {
      setIsMatching(true);
      try {
        const deletedTaskId = await deleteTask(taskData.id!).unwrap();
        console.log("deleted payload id", deletedTaskId);
        dispatch(lazyDeleteTask(deletedTaskId));
      } catch (error) {
        console.log(error);
      }
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
        <Trash2Icon
          className="ml-0.5 cursor-pointer hover:scale-110 transform duration-200 ease-in-out stroke-black/40"
          size={18}
        />
      </DialogTrigger>
      <DialogContent className="w-[400px] max-w-full p-4">
        <DialogHeader>
          <DialogTitle>
            Are you sure you want to delete "{taskData.title}" ?
          </DialogTitle>
          <DialogDescription>
            If so, type "{matchForDeletion}" to delete this task. <br />
            <span className="text-red-500">This action is permanent.</span>
          </DialogDescription>
          <div className="flex flex-col gap-2 mt-2">
            <input
              type="text"
              placeholder={matchForDeletion}
              className="h-9 px-2 outline-1 rounded-sm"
              onChange={(event) => setRepeatTaskTitle(event.target.value)}
            />
            {!isMatching && (
              <span className="text-sm text-red-500 mt-2">
                To delete this task, please type {<br />}
                {matchForDeletion}
              </span>
            )}
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
            onClick={handleDeleteTask}
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
