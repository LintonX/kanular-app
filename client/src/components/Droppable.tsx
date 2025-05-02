import React from "react";
import { useDndContext, useDroppable } from "@dnd-kit/core";
import { KanbanCard } from "@/lib/types";
import CardDropGhost from "./CardDropGhost";

export function Droppable({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { isOver, setNodeRef } = useDroppable({ id: id });
  const { active } = useDndContext();
  const activeCardData =
    (active?.data?.current as KanbanCard | undefined) ?? null;
  const showDropLocation = isOver && id !== activeCardData?.stage;

  return (
    <div className="h-full w-full overflow-y-scroll" ref={setNodeRef}>
      {children}
      {showDropLocation && <CardDropGhost overNewColumn={true} />}
    </div>
  );
}
