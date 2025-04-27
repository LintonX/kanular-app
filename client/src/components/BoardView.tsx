import Board from "./Board/Board";
import { useSelector } from "react-redux";
import { selectUserSession } from "@/features/slice/userSession/userSessionSlice";
import HomeBoardView from "./HomeBoardView";
import { CompleteKanbanBoard } from "@/lib/types";

export default function BoardView({
  boardId,
  board,
}: {
  boardId?: string;
  board?: CompleteKanbanBoard;
}) {
  const { viewedBoards } = useSelector(selectUserSession);

  let completeBoard;

  if (boardId) {
    console.log("found boardId")
    completeBoard = viewedBoards[boardId]
  } else if (board) {
    console.log("found board")
    completeBoard = board;
  } else {
    console.log("didnt find board, routing to home board view")
    return <HomeBoardView />
  }

  return (
    <div className="flex h-99/100 w-full">
      <Board completeBoard={completeBoard} />
    </div>
  );
}
