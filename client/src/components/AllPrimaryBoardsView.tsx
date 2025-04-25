import { useGetAllPrimaryBoardsQuery } from "@/features/api/board-api";
import { useDispatch } from "react-redux";
import BoardCard from "./BoardCard";
import { setAllPrimaryBoards } from "@/features/slice/userSession/userSessionSlice";
import CreateBoardCard from "./CreateBoardCard";
import { useEffect, useState } from "react";
import LoadingBoard from "./LoadingBoard";

export default function AllPrimaryBoardsView() {
  console.log("in all primary boards view");
  const dispatch = useDispatch();
  const [isBoardLoading, setIsBoardLoading] = useState(false);
  const {
    data: primaryBoards,
    isLoading,
    isFetching,
  } = useGetAllPrimaryBoardsQuery();

  useEffect(() => {
    if (primaryBoards) {
      dispatch(setAllPrimaryBoards(primaryBoards));
    }
  }, [primaryBoards, dispatch]);

  return isLoading || isFetching || isBoardLoading  ? (
    <LoadingBoard />
  ) : (
    <div className="flex flex-col w-full h-full gap-3">
      <CreateBoardCard />
      <div className="flex flex-wrap gap-4">
        {primaryBoards &&
          primaryBoards.map((board) =>
            board.primaryBoard ? (
              <BoardCard key={board.id} boardMetadata={board} setIsBoardLoading={setIsBoardLoading} />
            ) : null
          )}
      </div>
    </div>
  );
}
