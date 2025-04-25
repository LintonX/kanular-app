import { CompleteKanbanBoard, KanbanBoard } from "@/lib/types";
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
import {
  addSidebarItem,
  selectUserSidebar,
  setSelectedView,
} from "@/features/slice/userSidebar/userSidebarSlice";
import { AUTH_DASHBOARD, SIDEBAR_ITEMS } from "@/lib/constants";
import { store } from "@/state/store";
import { useNavigate } from "react-router-dom";

export default function BoardCard({
  boardMetadata,
}: {
  boardMetadata: KanbanBoard;
}) {
  const heartSize = 34;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { activeBoard, viewedBoards } = useSelector(selectUserSession);
  const { sidebarItems } = useSelector(selectUserSidebar);
  const [setNewFavorite] = useSetNewFavoriteMutation();
  const [getCompleteBoard, { isLoading }] = useLazyGetCompleteBoardByIdQuery();

  const handleSetAsFavorite = () => {
    if (boardMetadata.homeBoard) return;
    setNewFavorite(boardMetadata.id!);
  };

  const handleFetchAndNavToCompleteBoard = async () => {
    console.log("in handleFetchCompleteBoard");
    if (boardMetadata.id === activeBoard.kanbanBoard.id) {
      dispatch(setSelectedView(SIDEBAR_ITEMS[0]));
      navigate(AUTH_DASHBOARD);
      return;
    }
    if (isLoading) return;
    try {
      const completeKanbanBoard = await getCompleteBoard(
        boardMetadata
      ).unwrap();
      dispatch(setViewedBoards(completeKanbanBoard));
      handleAddBoardToSidebar(completeKanbanBoard);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddBoardToSidebar = (
    completeKanbanboard: CompleteKanbanBoard
  ) => {
    console.log("in handleAddBoardToSidebar", viewedBoards);

    if (!completeKanbanboard.kanbanBoard.id) return;

    const updatedViewedBoards = store.getState().userSession.viewedBoards;

    const existingSidebarItem = sidebarItems.find(
      (board) => board.name === completeKanbanboard.kanbanBoard.title
    );

    if (existingSidebarItem) {
      dispatch(setSelectedView(existingSidebarItem));
      navigate(existingSidebarItem.path);
      return;
    }

    if (
      updatedViewedBoards.some(
        (board) => board.kanbanBoard.id === completeKanbanboard.kanbanBoard.id
      )
    ) {
      const newItem = {
        name: completeKanbanboard.kanbanBoard.title!,
        path: `${AUTH_DASHBOARD}?board=${completeKanbanboard.kanbanBoard.id}`,
      };
      dispatch(addSidebarItem(newItem));
      dispatch(setSelectedView(newItem));
      navigate(newItem.path);
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
