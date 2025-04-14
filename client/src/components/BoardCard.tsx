import { KanbanBoard } from "@/lib/types";
import { Star, StarOff } from "lucide-react";

export default function BoardCard({
  boardMetadata,
}: {
  boardMetadata: KanbanBoard;
}) {
  const starSize = 34;
  console.log(boardMetadata);

  return (
    <div className="flex flex-col w-72 h-48 bg-red-400 rounded-lg px-5 py-4">
      <div className="flex w-full justify-between items-center">
        <h1 className="font-medium text-xl">{boardMetadata.title}</h1>
        <div className="flex">
          {boardMetadata.homeBoard ? (
            <Star className="cursor-pointer" fill="yellow" stroke="none" size={starSize} />
          ) : (
            <StarOff size={starSize} />
          )}
        </div>
      </div>
    </div>
  );
}
