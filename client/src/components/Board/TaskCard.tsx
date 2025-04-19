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
  return (
    <div
      className={`flex flex-col justify-between w-full min-h-32 max-h-fit ${
        columnIndex === 0
          ? "bg-primary-red/40"
          : columnIndex === 1
          ? "bg-primary-yellow/40"
          : columnIndex === 2
          ? "bg-primary-blue/40"
          : columnIndex == 3
          ? "bg-primary-green/40"
          : "bg-primary-black/40"
      } rounded-lg p-2 mb-2`}
    >
      <div>
        <h1 className="bg-black/10 rounded-md px-2 py-0.5 mb-2">
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
