import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { KanbanCard } from "@/lib/types";

export function Draggable({
  data,
  children,
}: {
  data: KanbanCard;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: data.id!,
      data,
    });

  const style: React.CSSProperties = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    position: isDragging ? "relative" : "inherit",
    // zIndex: isDragging ? 10000 : 0,
    color: isDragging ? "blue" : "",
  };

  return (
    <div
      className="w-full"
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
    >
      {children}
    </div>
  );
}
