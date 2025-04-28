import { KanbanCard } from "@/lib/types";
import { Button } from "../ui/button";
import { ChevronDown, LoaderCircle } from "lucide-react";
import EditableTextarea from "../EditableTextarea";
import ConfirmDeleteTaskModal from "../ConfirmDeleteTaskModal";
import KanulizeModal from "../KanulizeModal";
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
import { useLazyGetCompleteBoardByParentIdQuery } from "@/features/api/board-api";
import { store } from "@/state/store";

export default function TaskCard({
  card,
  columnIndex,
}: {
  card: KanbanCard;
  columnIndex: number;
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { sidebarItems } = useSelector(selectUserSidebar);
  const [getChildBoard, { isLoading, isFetching }] =
    useLazyGetCompleteBoardByParentIdQuery();

  const color =
    columnIndex === 0
      ? "bg-primary-red/30"
      : columnIndex === 1
      ? "bg-primary-yellow/30"
      : columnIndex === 2
      ? "bg-primary-blue/30"
      : columnIndex == 3
      ? "bg-primary-green/30"
      : "bg-primary-black/30";

  // const faketrue = card.title === 'replace activeboard with homeboard' || card.title === "💡 Tip: Drag cards around";

  const handleLoadChildBoard = async () => {
    console.log("attempting to load child board");
    if (card.hasChildBoard) {
      // get child board based on card id
      try {
        const completeChildBoard = await getChildBoard({
          parentId: card.id!,
          primaryBoard: false,
          homeBoard: false,
        }).unwrap();
        if (completeChildBoard) {
          dispatch(setViewedBoards(completeChildBoard));
          const updatedViewedBoards = store.getState().userSession.viewedBoards;
          dispatch(
            setActiveBoard(
              updatedViewedBoards[completeChildBoard.kanbanBoard.id!]
            )
          );
          dispatch(setSelectedView(sidebarItems[0]));
          navigate(sidebarItems[0].path);
          return;
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div
      className={`flex flex-col justify-between w-full min-h-32 max-h-fit rounded-lg p-2 mb-2
    ${color} ${card.hasChildBoard ? `border-b-6 border-black/30` : ""}`}
    >
      <div>
        <h1 className={`${color} rounded-md px-2 py-0.5 mb-2`}>{card.title}</h1>
        <div className="w-full text-sm px-1 py-0.5 mb-2 h-fit">
          <EditableTextarea cardId={card.id!} body={card.body!} />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <ConfirmDeleteTaskModal taskData={card} />
        {card.hasChildBoard ? (
          isFetching || isLoading ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            <Button
              onClick={handleLoadChildBoard}
              variant={"outline"}
              disabled={isLoading || isFetching}
              className="w-10 h-6 border-2 border-black/40  hover:w-22 transform ease-in duration-150"
            >
              <ChevronDown size={20} className="animate-bounce translate-y-1 stroke-black/40 stroke-3" />
            </Button>
          )
        ) : (
          <KanulizeModal parentId={card.id!} taskTitle={card.title!} />
        )}
      </div>
    </div>
  );
}
