import { KanbanCard, Stage } from "@/lib/types";
import TaskCard from "./TaskCard";
import { getStage } from "@/lib/utils";
import CreateTaskModal from "../CreateTaskModal";
import { Droppable } from "../Droppable";

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
  const stageTitle = getStage(column);
  const isTodoColumn = stageTitle === Stage.TO_DO;

  return (
    <div
      className={`flex flex-col bg-white h-[670px] w-[282px] p-2 z-0 rounded-lg shadow-sm/2 border-t border-orange-50 backdrop-blur-2xl border-opacity-30`}
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
        <div className="flex justify-between">
          <h1>{stageTitle}</h1>
          <div className="bg-white/25 px-2 rounded-md">{cards.length}</div>
        </div>
      </div>
      <Droppable id={column}>
        <div className="space-y-2">
          {cards
            .sort((a, b) => +(a.timeCreated ?? 0) - +(b.timeCreated ?? 0))
            .map((card) => (
              <TaskCard key={card.id} card={card} columnIndex={index} />
            ))}
        </div>
      </Droppable>
      <div className="mt-1">
        {isTodoColumn && (
          <CreateTaskModal parentId={boardId} stage={column as Stage} />
        )}
      </div>
    </div>
  );
}
