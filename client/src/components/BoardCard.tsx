import { KanbanBoard } from "@/lib/types";
import { Heart } from "lucide-react";
import ConfirmDeleteModal from "./ConfirmBoardDeleteModal";
import {
  useLazyGetCompleteBoardByIdQuery,
  useSetNewFavoriteMutation,
} from "@/features/api/board-api";
import { useDispatch, useSelector } from "react-redux";
import {
  selectUserSession,
  setViewedBoards,
} from "@/features/slice/userSession/userSessionSlice";
import { useDashboardContext } from "@/lib/dashboardContext";
import { sidebarItems } from "@/lib/constants";

export default function BoardCard({
  boardMetadata,
}: {
  boardMetadata: KanbanBoard;
}) {
  const dispatch = useDispatch();
  const dashboardContext = useDashboardContext();
  const { activeBoard } = useSelector(selectUserSession);
  const [setNewFavorite] = useSetNewFavoriteMutation();
  const [getCompleteBoard, { isLoading }] = useLazyGetCompleteBoardByIdQuery();
  const heartSize = 34;

  const handleSetAsFavorite = () => {
    if (boardMetadata.homeBoard) return;
    setNewFavorite(boardMetadata.id!);
  };

  const handleSetAsActiveBoard = async () => {
    console.log("in handleSetAsActiveBoard");
    if (boardMetadata.id === activeBoard.kanbanBoard.id) return;
    if (isLoading) return;
    try {
      const completeKanbanBoard = await getCompleteBoard(
        boardMetadata
      ).unwrap();
      console.log("retrieved complete kanban board", completeKanbanBoard);
      dispatch(setViewedBoards(completeKanbanBoard));
    //   dashboardContext.setSelectedView(sidebarItems[0]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      onClick={handleSetAsActiveBoard}
      className="flex flex-col w-72 h-48 bg-red-400 rounded-lg px-5 py-4 cursor-pointer transform hover:scale-[1.02] duration-200 ease-in-out"
    >
      <div className="flex w-full justify-between items-center">
        <h1 className="font-medium text-xl">{boardMetadata.title}</h1>
        <div className="flex">
          {boardMetadata.homeBoard ? (
            <Heart
              className="cursor-pointer"
              fill="red"
              stroke="none"
              size={heartSize}
            />
          ) : (
            <Heart
              onClick={handleSetAsFavorite}
              className="cursor-pointer"
              fill="none"
              stroke="black"
              strokeWidth={2}
              size={heartSize - 3}
            />
          )}
        </div>
      </div>
      <div className="flex flex-col h-full w-fit justify-end">
        <ConfirmDeleteModal boardMetadata={boardMetadata} />
      </div>
    </div>
  );
}
