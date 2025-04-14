import { KanbanCard, KanbanColumn, Stage } from "@/lib/types";
import TaskCard from "./TaskCard";
import { getStage } from "@/lib/utils";
import { Button } from "../ui/button";

export default function ColumnCard({ column, cards }: { column: KanbanColumn, cards: KanbanCard[] }) {
  const stage = getStage(column.stage!);
  const isTodoColumn = stage === Stage.TO_DO;
  
  return (
    <div className="flex flex-col bg-red-400 h-full w-[282px] p-2 rounded-lg">
      {stage}
      {cards.map(card => <TaskCard key={card.id} card={card}/>)}
      <div className="mt-2">
      {isTodoColumn && <Button className="w-1/3"> + add task</Button>}
      </div>
    </div>
  );
}
