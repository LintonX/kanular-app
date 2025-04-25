import Board from "./Board/Board";
import { useSelector } from "react-redux";
import { selectUserSession } from "@/features/slice/userSession/userSessionSlice";
import { CompleteKanbanBoard } from "@/lib/types";

export default function BoardView({
  boardId,
  board,
}: {
  boardId?: string;
  board?: CompleteKanbanBoard;
}) {
  const { viewedBoards } = useSelector(selectUserSession);

  const completeBoard = board ?? viewedBoards.find((currBoard) => currBoard.kanbanBoard.id === boardId);

  if (!completeBoard) return null;

  return (
    <div className="flex h-99/100 w-full">
      <Board completeBoard={completeBoard} />
    </div>
  );
}
