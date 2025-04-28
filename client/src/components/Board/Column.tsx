import { KanbanCard, Stage } from "@/lib/types";
import TaskCard from "./TaskCard";
import { getStage, parseStage } from "@/lib/utils";
import CreateTaskModal from "../CreateTaskModal";

export default function Column({
  column,
  boardId,
  cards,
  index,
}: {
  column: string;
  boardId: string;
  cards: KanbanCard[];
  index: number;
}) {

  console.log("column data", column, boardId, cards, index)

  const stageTitle = getStage(column);
  const isTodoColumn = stageTitle === Stage.TO_DO;

  return (
    <div
      className={`flex flex-col bg-white h-[670px] w-[282px] p-2 rounded-lg shadow-sm/2 border-t border-orange-50 backdrop-blur-2xl border-opacity-30`}
    >
      <div
        className={`${
          index === 0
            ? "bg-primary-red"
            : index === 1
            ? "bg-primary-yellow"
            : index === 2
            ? "bg-primary-blue"
            : index == 3
            ? "bg-primary-green"
            : "bg-primary-black"
        } -mx-2 -mt-2 p-2 mb-2 rounded-t-lg`}
      >
        {stageTitle}
      </div>
      <div className="overflow-y-scroll space-y-2">
        {cards
          .sort((a, b) => +(a.timeCreated ?? 0) - +(b.timeCreated ?? 0))
          .map((card) => (
            <TaskCard key={card.id} card={card} columnIndex={index} />
          ))}
      </div>
      <div className="mt-1">
        {isTodoColumn && (
          <CreateTaskModal parentId={boardId} stage={column as Stage} />
        )}
      </div>
    </div>
  );
}
