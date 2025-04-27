import { useDispatch, useSelector } from "react-redux";
import Column from "./Column";
import { CompleteKanbanBoard, KanbanCard, Stage } from "@/lib/types";
import { removeFromBoardStack, } from "@/features/slice/userSession/userSessionSlice";
import { selectUserSidebar, setSelectedView } from "@/features/slice/userSidebar/userSidebarSlice";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { ChevronLeft } from "lucide-react";

export default function Board({
  completeBoard,
}: {
  completeBoard: CompleteKanbanBoard;
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { sidebarItems } = useSelector(selectUserSidebar);

  if (!completeBoard) {
    return <div>Error: No board found</div>;
  }

  const { kanbanBoard, kanbanColumns, kanbanCards } = completeBoard;

  const columnStagesToCardsMap = new Map<Stage, KanbanCard[]>([]);

  kanbanCards.forEach((card) => {
    const existingCards = columnStagesToCardsMap.get(card.stage!) || [];
    columnStagesToCardsMap.set(card.stage!, [...existingCards, card]);
  });

  const handleGoBack = () => {
    console.log("PRESSED PRESSED PRESSED")
    dispatch(removeFromBoardStack());
    dispatch(setSelectedView(sidebarItems[0]));
    navigate(sidebarItems[0].path);
  }

  return (
    <div className="h-full">
      <h1 className="flex items-center font-bold text-2xl mb-2 gap-4">
        {!kanbanBoard.primaryBoard && <Button variant={"outline"} onClick={handleGoBack} className="h-7"><ChevronLeft className="-mr-2 -ml-1" />Go Back</Button>}
        {kanbanBoard.title}
      </h1>
      <div className="grid grid-cols-4 gap-2 h-[670px] w-full">
        {kanbanColumns.map(
          (currColumn, index) =>
            currColumn.stage && (
              <Column
                key={currColumn.id}
                column={currColumn}
                index={index}
                cards={columnStagesToCardsMap.get(currColumn.stage) || []}
              />
            )
        )}
      </div>
    </div>
  );
}
