import {} from "@/lib/types";
import Board from "./Board/Board";
import { useSelector } from "react-redux";
import { selectUserSession } from "@/features/slice/userSession/userSessionSlice";

export default function BoardView() {
  const { homeBoard } = useSelector(selectUserSession);

  return (
    <div className="flex w-full h-5/6">
      <Board completeBoard={homeBoard} />
    </div>
  );
}
