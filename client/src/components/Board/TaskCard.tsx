import { KanbanCard } from "@/lib/types";
import { Button } from "../ui/button";
import { Trash2Icon } from "lucide-react";
import { useState } from "react";
import EditableField from "../EditableTextarea";

export default function TaskCard({ card }: { card: KanbanCard }) {

  const [wasEdited, setWasEdited] = useState<boolean>();

  return (
    <div className="flex flex-col justify-between w-full min-h-32 max-h-96 bg-yellow-300 rounded-lg p-2">
      <div>
        <h1 className="bg-black/10 rounded-md px-1 py-0.5 mb-2">{card.title}</h1>
        <div className="w-full text-sm px-1 py-0.5 mb-2">
          <EditableField cardId={card.id!} body={card.body!}/>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <Trash2Icon className="ml-0.5" size={18}/>
        <Button className="h-7 text-xs font-normal mr-0.5" variant={"default"}>
          Kanulize
        </Button>
      </div>
    </div>
  );
}
