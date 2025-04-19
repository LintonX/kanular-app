import { KanbanBoard } from "@/lib/types";
import { Heart } from "lucide-react";
import ConfirmDeleteModal from "./ConfirmBoardDeleteModal";
import { useSetNewFavoriteMutation } from "@/features/api/board-api";

export default function BoardCard({
  boardMetadata,
}: {
  boardMetadata: KanbanBoard;
}) {

    const [setNewFavorite] = useSetNewFavoriteMutation();
  const heartSize = 34;

  const handleSetAsFavorite = () => {
    if (boardMetadata.homeBoard) return
    setNewFavorite(boardMetadata.id!);
  }

  return (
    <div className="flex flex-col w-72 h-48 bg-red-400 rounded-lg px-5 py-4">
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
            <Heart onClick={handleSetAsFavorite} className="cursor-pointer" fill="none" stroke="black" strokeWidth={2} size={heartSize - 3} />
          )}
        </div>
      </div>
      <div className="flex flex-col h-full w-fit justify-end">
        <ConfirmDeleteModal boardMetadata={boardMetadata} />
      </div>
    </div>
  );
}
