import { useGetAllPrimaryBoardsQuery } from "@/features/api/board-api";
import { useDispatch } from "react-redux";
import BoardCard from "./BoardCard";
import {
  setAllPrimaryBoards,
} from "@/features/slice/userSession/userSessionSlice";
import CreateBoardCard from "./CreateBoardCard";
import { useEffect } from "react";

export default function AllPrimaryBoardsView() {
  const dispatch = useDispatch();
  const {
    data: primaryBoards,
  } = useGetAllPrimaryBoardsQuery();

  useEffect(() => {
    if (primaryBoards) {
      dispatch(setAllPrimaryBoards(primaryBoards));
    }
  }, [primaryBoards, dispatch]);

  return (
    <div className="flex flex-col w-full h-full gap-3">
      <CreateBoardCard />
      <div className="flex flex-wrap gap-4">
        {primaryBoards &&
          primaryBoards.map((board) =>
            board.primaryBoard ? (
              <BoardCard key={board.id} boardMetadata={board} />
            ) : null
          )}
      </div>
    </div>
  );
}
