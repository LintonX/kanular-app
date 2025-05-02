import { KanbanCard } from "@/lib/types";
import { Button } from "../ui/button";
import { ChevronDown, LoaderCircle, GripVertical } from "lucide-react";
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
import { useDraggable } from "@dnd-kit/core";
import CardDropGhost from "../CardDropGhost";

export default function TaskCard({
  card,
  columnIndex,
}: {
  card: KanbanCard;
  columnIndex?: number;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: card.id!,
      data: card,
    });
  const style: React.CSSProperties = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    // position: isDragging ? "relative" : "inherit",
    color: isDragging ? "blue" : "",
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { sidebarItems } = useSelector(selectUserSidebar);
  const [getChildBoard, { isLoading, isFetching }] =
    useLazyGetCompleteBoardByParentIdQuery();

  if (isDragging) {
    return (
      <CardDropGhost overNewColumn={false}/>
    );
  }

  const color1 =
    columnIndex === 0
      ? "bg-primary-red-washed"
      : columnIndex === 1
      ? "bg-primary-yellow-washed"
      : columnIndex === 2
      ? "bg-primary-blue-washed"
      : columnIndex == 3
      ? "bg-primary-green-washed"
      : "bg-neutral-300";

  const color2 =
    columnIndex === 0
      ? "bg-primary-red-medium"
      : columnIndex === 1
      ? "bg-primary-yellow-medium"
      : columnIndex === 2
      ? "bg-primary-blue-medium"
      : columnIndex == 3
      ? "bg-primary-green-medium"
      : "bg-neutral-400";

  const color3 =
    columnIndex === 0
      ? "bg-primary-red/20"
      : columnIndex === 1
      ? "bg-primary-yellow/20"
      : columnIndex === 2
      ? "bg-primary-blue/20"
      : columnIndex == 3
      ? "bg-primary-green/20"
      : "bg-neutral-400/20";

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
      ref={setNodeRef}
      style={style}
      className={`flex flex-col justify-between w-full min-h-32 max-h-fit rounded-lg p-2 transition-transform ease-in-out duration-700
      ${color1} ${card.hasChildBoard ? `border-b-6 border-black/30` : ""}`}
    >
      <div className="flex flex-col">
        <div className="flex justify-between h-fit items-center">
          <div className={`flex ${color2} w-full h-fit rounded-md pl-2 py-0.5 mb-2 -pr-1 justify-between items-center`}>
            <h1>{card.title}</h1>
            <div
              {...listeners}
              {...attributes}
              className={`flex flex-col w-8 h-full rounded-md hover:cursor-grab justify-center items-center`}
            >
              <GripVertical size={23}
                className={`stroke-neutral-500/70 outline-none focus:outline-none active:outline-none`}
              />
            </div>
          </div>
        </div>
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
              <ChevronDown
                size={20}
                className="animate-bounce translate-y-1 stroke-black/40 stroke-3"
              />
            </Button>
          )
        ) : (
          <KanulizeModal parentId={card.id!} taskTitle={card.title!} />
        )}
      </div>
    </div>
  );
}
