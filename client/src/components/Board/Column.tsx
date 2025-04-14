import { KanbanCard, KanbanColumn, Stage } from "@/lib/types";
import TaskCard from "./TaskCard";
import { getStage } from "@/lib/utils";
import AddTaskModal from "../AddTaskModal";

export default function ColumnCard({ column, cards }: { column: KanbanColumn, cards: KanbanCard[] }) {
  const stage = getStage(column.stage!);
  const isTodoColumn = stage === Stage.TO_DO;
  
  return (
    <div className="flex flex-col bg-red-400 h-full w-[282px] p-2 rounded-lg">
      {stage}
      {cards.map(card => <TaskCard key={card.id} card={card}/>)}
      <div>
      {isTodoColumn && <AddTaskModal parentId={column.id!} stage={column.stage!} />}
      </div>
    </div>
  );
}
