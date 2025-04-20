import { KanbanCard } from "@/lib/types";
import { Button } from "../ui/button";
import EditableTextarea from "../EditableTextarea";
import ConfirmDeleteTaskModal from "../ConfirmDeleteTaskModal";

export default function TaskCard({
  card,
  columnIndex,
}: {
  card: KanbanCard;
  columnIndex: number;
}) {

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

  return (
    <div
      className={`flex flex-col justify-between w-full min-h-32 max-h-fit ${color} rounded-lg p-2 mb-2`}
    >
      <div>
        <h1 className={`${color} rounded-md px-2 py-0.5 mb-2 border-1 border-white/50`}>
          {card.title}
        </h1>
        <div className="w-full text-sm px-1 py-0.5 mb-2 h-fit">
          <EditableTextarea cardId={card.id!} body={card.body!} />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <ConfirmDeleteTaskModal taskData={card} />
        <Button className="h-7 text-xs font-normal mr-0.5" variant={"outline"}>
          Kanulize
        </Button>
      </div>
    </div>
  );
}
