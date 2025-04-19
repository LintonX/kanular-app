import {} from "@/lib/types";
import Board from "./Board/Board";
import { useSelector } from "react-redux";
import { selectUserSession } from "@/features/slice/userSession/userSessionSlice";

export default function BoardView() {
  const { activeBoard } = useSelector(selectUserSession);

  return (
    <div className="flex h-99/100 w-full">
      <Board completeBoard={activeBoard} />
    </div>
  );
}
