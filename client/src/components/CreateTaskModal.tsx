import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { useCreateTaskMutation } from "@/features/api/board-api";
import { Stage } from "@/lib/types";
import { LoaderCircle } from "lucide-react";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useDispatch } from "react-redux";
import { lazyCreateTask } from "@/features/slice/userSession/userSessionSlice";

export default function CreateTaskModal({
  parentId,
  stage,
}: {
  parentId: string;
  stage: Stage;
}) {
  const dispatch = useDispatch();
  const [createTask, { isError, isLoading, isSuccess }] =
    useCreateTaskMutation();
  const [taskTitle, setTaskTitle] = useState("");
  const [taskBody, setTaskBody] = useState("");
  const [keepModalOpen, setKeepModalOpen] = useState(false);

  const handleCreateTask = async () => {
    if (!taskTitle.trim() || !taskBody.trim()) return;
    try {
      const { data: createdTask } = await createTask({
        parentId: parentId,
        title: taskTitle.trim(),
        body: taskBody.trim(),
        hasChildBoard: false,
        stage: stage, 
      });
      console.log("create task payload", createdTask);
      dispatch(lazyCreateTask(createdTask!));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setTaskTitle("");
      setTaskBody("");
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
        <Button variant={"default"} className="h-7 text-xs w-full bg-secondary-black">
          + Create Task
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[350px] max-w-full p-4">
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
          <div className="flex flex-col gap-2 mt-2">
            <input
              type="text"
              placeholder={"Add Title"}
              className="h-9 px-2 outline-1 rounded-sm"
              onChange={(event) => setTaskTitle(event.target.value)}
            />
            <textarea
              name="body"
              placeholder={"Add your task description here"}
              className="resize-none p-2 h-24 outline-1 rounded-sm"
              onChange={(event) => setTaskBody(event.target.value)}
            ></textarea>
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
            onClick={handleCreateTask}
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
