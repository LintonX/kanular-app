import { useDispatch, useSelector } from "react-redux";
import Column from "./Column";
import { CompleteKanbanBoard, KanbanCard, Stage } from "@/lib/types";
import {
  lazyUpdateTaskColumn,
  removeFromBoardStack,
} from "@/features/slice/userSession/userSessionSlice";
import {
  selectUserSidebar,
  setSelectedView,
} from "@/features/slice/userSidebar/userSidebarSlice";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { ChevronLeft } from "lucide-react";
import { STAGE_COLUMNS } from "@/lib/constants";
import {
  closestCorners,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import { useState } from "react";
import TaskCard from "./TaskCard";

export default function Board({
  completeBoard,
}: {
  completeBoard: CompleteKanbanBoard;
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTaskCard, setActiveTaskCard] = useState<KanbanCard | null>(null);
  const { sidebarItems } = useSelector(selectUserSidebar);

  if (!completeBoard) {
    console.log("no board found");
    return <div>Error: No board found</div>;
  }

  const { kanbanBoard, kanbanCards } = completeBoard;

  const columnStagesToCardsMap = new Map<Stage, KanbanCard[]>([]);

  kanbanCards.forEach((card) => {
    const existingCards = columnStagesToCardsMap.get(card.stage!) || [];
    columnStagesToCardsMap.set(card.stage!, [...existingCards, card]);
  });

  // console.log("columnstagestocardsmap", columnStagesToCardsMap);
  // console.log("stagecolumns", STAGE_COLUMNS);

  const handleGoBack = () => {
    dispatch(removeFromBoardStack());
    dispatch(setSelectedView(sidebarItems[0]));
    navigate(sidebarItems[0].path);
  };

  const handleDragStart = (event: DragStartEvent) => {
    console.log("im being draggeddddd", event);
    const card = event.active.data?.current as KanbanCard | undefined;
    if (card) {
      setActiveTaskCard(card);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    console.log(event);
    const activeCard = event.active.data.current as KanbanCard | undefined;
    const overColumn = event.over?.id as Stage;
    if (activeCard && overColumn !== activeCard.stage) {
      console.log("card is trying to move columns", activeCard, overColumn);

      // update card to overColumn via backend
      // on success, update card to overColumn stage lazily
      dispatch(
        lazyUpdateTaskColumn({
          activeCardId: activeCard.id!,
          activeBoardId: completeBoard.kanbanBoard.id!,
          toStage: overColumn,
        })
      );
      // overColumn should visualize that the card is about to be dropped there and was dropped
    }
    setActiveTaskCard(null);
  };

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      collisionDetection={closestCorners}
      // autoScroll={{ enabled: false }}
    >
      <div className="h-full">
        <h1 className="flex items-center font-bold text-2xl mb-2 gap-4">
          {!kanbanBoard.primaryBoard && (
            <Button variant={"outline"} onClick={handleGoBack} className="h-7">
              <ChevronLeft className="-mr-2 -ml-1" />
              Go Back
            </Button>
          )}
          {kanbanBoard.title}
        </h1>
        <div className="grid grid-cols-4 gap-2 h-[670px] w-full">
          {STAGE_COLUMNS.map((column, index) => (
            <Column
              key={column}
              column={column}
              boardId={kanbanBoard.id!}
              index={index}
              cards={columnStagesToCardsMap.get(column as Stage) || []}
            />
          ))}
        </div>
        <DragOverlay dropAnimation={{ duration: 200, easing: "ease-in-out" }}>
          {activeTaskCard && <TaskCard card={activeTaskCard} />}
        </DragOverlay>
      </div>
    </DndContext>
  );
}
