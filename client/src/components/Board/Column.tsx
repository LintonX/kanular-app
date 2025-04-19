import { KanbanCard, KanbanColumn, Stage } from "@/lib/types";
import TaskCard from "./TaskCard";
import { getStage } from "@/lib/utils";
import AddTaskModal from "../CreateTaskModal";

export default function Column({
  column,
  cards,
}: {
  column: KanbanColumn;
  cards: KanbanCard[];
}) {
  const stage = getStage(column.stage!);
  const isTodoColumn = stage === Stage.TO_DO;

  return (
    <div className="flex flex-col bg-red-400 h-[670px] w-[282px] p-2 rounded-lg">
      <div className="">{stage}</div>
      <div className="overflow-y-scroll space-y-2">
        {cards
          .sort((a, b) => +(a.timeCreated ?? 0) - +(b.timeCreated ?? 0))
          .map((card) => (
            <TaskCard key={card.id} card={card} />
          ))
        }
      </div>
      <div className="mt-1">
        {isTodoColumn && (
          <AddTaskModal parentId={column.id!} stage={column.stage!} />
        )}
      </div>
    </div>
  );
}
