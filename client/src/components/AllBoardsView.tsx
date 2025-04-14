import { useGetAllPrimaryBoardsQuery } from "@/features/api/board-api";
import { useDispatch } from "react-redux";
import BoardCard from "./BoardCard";
import { setAllPrimaryBoards } from "@/features/slice/userSession/userSessionSlice";
import CreateBoardCard from "./CreateBoardCard";

export default function AllPrimaryBoardsView() {
  const dispatch = useDispatch();
  const {
    data: primaryBoards,
    isError,
    isLoading,
    isSuccess,
  } = useGetAllPrimaryBoardsQuery();

  dispatch(setAllPrimaryBoards(primaryBoards || []));

  return (
    <div className="flex flex-wrap gap-4">
      {primaryBoards && primaryBoards.map((board) => board.primaryBoard ? <BoardCard key={board.id} boardMetadata={board} /> : null)}
      <CreateBoardCard />
    </div>
  );
}
