import { Column } from "@/lib/types";
import TaskCard from "./TaskCard";
import { Button } from "../ui/button";

export default function ColumnCard({ column }: { column: Column }) {
  return (
    <div key={column.id} className="flex flex-col bg-red-400 h-full w-[282px] p-2 rounded-lg">
      {column.title}
      {<TaskCard />}
      {column.index === 0 && <Button className="w-1/3"> + add task</Button>}
    </div>
  );
}
