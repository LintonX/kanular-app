import { CompleteKanbanBoard, KanbanBoard } from "@/lib/types";
import { Heart } from "lucide-react";
import ConfirmDeleteModal from "./ConfirmBoardDeleteModal";
import {
  useLazyGetCompleteBoardByIdQuery,
  useSetNewFavoriteMutation,
} from "@/features/api/board-api";
import { useDispatch, useSelector } from "react-redux";
import {
  clearBoardStack,
  selectUserSession,
  setActiveBoard,
  setViewedBoards,
} from "@/features/slice/userSession/userSessionSlice";
import {
  selectUserSidebar,
  setSelectedView,
} from "@/features/slice/userSidebar/userSidebarSlice";
import { store } from "@/state/store";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function BoardCard({
  boardMetadata,
  setIsBoardLoading,
}: {
  boardMetadata: KanbanBoard;
  setIsBoardLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const heartSize = 34;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { activeBoardStack, viewedBoards } = useSelector(selectUserSession);
  const { sidebarItems } = useSelector(selectUserSidebar);
  const [setNewFavorite] = useSetNewFavoriteMutation();
  const [getCompleteBoard, { isLoading, isFetching }] =
    useLazyGetCompleteBoardByIdQuery();

  useEffect(() => {
    if (isLoading || isFetching) {
      setIsBoardLoading(true);
    }
  }, [isLoading, isFetching, setIsBoardLoading]);

  const handleSetAsFavorite = () => {
    if (boardMetadata.homeBoard) return;
    setNewFavorite(boardMetadata.id!);
  };

  const handleFetchAndNavToCompleteBoard = async () => {
    console.log("in handleFetchCompleteBoard");
    if (isLoading || isFetching) return;
    if (boardMetadata.id === activeBoardStack.peek()) {
      // clicked board is already the current active board
      //   dispatch(setActiveBoard(viewedBoards[activeBoardStack.peek()!]));
      dispatch(setSelectedView(sidebarItems[0]));
      navigate(sidebarItems[0].path);
      return;
    }

    //  add logic to skip the next part if the board is already in viewed boards
    // clicked board is not active board, we need to fetch and make active
    try {
      const completeKanbanBoard = await getCompleteBoard(
        boardMetadata
      ).unwrap();
      handleMakeActiveBoard(completeKanbanBoard);
    } catch (error) {
      console.log(error);
    }
  };

  const handleMakeActiveBoard = (completeKanbanBoard: CompleteKanbanBoard) => {
    console.log("in handleMakeActiveBoard", viewedBoards);

    if (!completeKanbanBoard.kanbanBoard.id) return;
    console.log("complete board", completeKanbanBoard);
    dispatch(setViewedBoards(completeKanbanBoard));
    const updatedViewedBoards = store.getState().userSession.viewedBoards;

    if (updatedViewedBoards[completeKanbanBoard.kanbanBoard.id]) {
      // need to clear the existing stack
      dispatch(clearBoardStack());
      dispatch(
        setActiveBoard(updatedViewedBoards[completeKanbanBoard.kanbanBoard.id])
      );
      dispatch(setSelectedView(sidebarItems[0]));
      navigate(sidebarItems[0].path);
      return;
    }
  };

  return (
    <div
      onClick={handleFetchAndNavToCompleteBoard}
      className="flex flex-col w-72 h-48 bg-red-400 rounded-lg px-5 py-4 cursor-pointer transform hover:scale-[1.02] duration-200 ease-in-out"
    >
      <div className="flex w-full justify-between items-center">
        <h1 className="font-medium text-xl">{boardMetadata.title}</h1>
        <div className="flex rounded-full bg-red-300 justify-center items-center p-1">
          {boardMetadata.homeBoard ? (
            <Heart
              className="cursor-pointer translate-y-0.5"
              fill="red"
              stroke="none"
              size={heartSize}
            />
          ) : (
            <Heart
              onClick={handleSetAsFavorite}
              className="cursor-pointer translate-y-0.5"
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
