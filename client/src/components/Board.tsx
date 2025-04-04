import { columns } from "@/lib/constants";
import ColumnCard from "./Column";

export default function Board({ boardId }: { boardId: string }) {
  return (
    <div>
      boardId {boardId}
      <div className="grid grid-cols-4 gap-2 h-full w-full">
        {columns.sort().map((column) => (
            <ColumnCard column={column} />
        ))}
      </div>
    </div>
  );
}
