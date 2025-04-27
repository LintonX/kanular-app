import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { LoaderCircle } from "lucide-react";
import { useCreateChildBoardMutation } from "@/features/api/board-api";
import { useDispatch, useSelector } from "react-redux";
import {
  setActiveBoard,
  setViewedBoards,
} from "@/features/slice/userSession/userSessionSlice";
import {
  selectUserSidebar,
  setSelectedView,
} from "@/features/slice/userSidebar/userSidebarSlice";
import { useNavigate } from "react-router-dom";

export default function KanulizeModal({
  parentId,
  taskTitle,
}: {
  parentId: string;
  taskTitle: string;
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { sidebarItems } = useSelector(selectUserSidebar);
  const [createChildBoard, { isError, isLoading, isSuccess }] =
    useCreateChildBoardMutation();
  const [keepModalOpen, setKeepModalOpen] = useState(false);

  const handleCreateBoard = async () => {
    try {
      const completeChildBoard = await createChildBoard({
        parentId,
        taskTitle,
      }).unwrap();
      if (completeChildBoard) {
        //set taskcard as has child lazyily
        //set taskcard childs board lazily
        //set as active board
        dispatch(setViewedBoards(completeChildBoard));
        dispatch(setActiveBoard(completeChildBoard));
        dispatch(setSelectedView(sidebarItems[0]));
        navigate(sidebarItems[0].path);
      }
    } catch (error) {
      console.log(error);
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
        <Button variant={"outline"} className="flex bg-none text-sm h-6">
          Kanulize
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[350px] max-w-full p-4">
        <DialogHeader>
          <DialogTitle>
            Would you like to Kanulize task {<br />}'
            <span className="font-normal">{taskTitle}</span>'?
          </DialogTitle>
          <DialogDescription>
            Drill down. Create a sub-board and break it into more granular
            tasks.
          </DialogDescription>
          <div className="flex flex-col gap-2 mt-2">
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
      </DialogContent>
    </Dialog>
  );
}
