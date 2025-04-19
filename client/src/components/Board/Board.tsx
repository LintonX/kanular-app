import Column from "./Column";
import { CompleteKanbanBoard, KanbanCard, Stage } from "@/lib/types";

export default function Board({completeBoard}: {completeBoard: CompleteKanbanBoard}) {

  if (completeBoard) {
    console.log("HEYSYFSIJFSJE")
  } else {
    return <div>asfas</div>
  }

  const { kanbanBoard, kanbanColumns, kanbanCards } = completeBoard;

  const columnStagesToCardsMap = new Map<Stage, KanbanCard[]>([]);
  kanbanCards.forEach((card) => {
    const existingCards = columnStagesToCardsMap.get(card.stage!) || [];
    columnStagesToCardsMap.set(card.stage!, [...existingCards, card]);
  });

  return (
    <div className="h-full">
      <h1 className="font-bold text-3xl">{kanbanBoard.title}</h1>
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
