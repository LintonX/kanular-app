import { useGetAllPrimaryBoardsQuery } from "@/features/api/board-api";
import { useDispatch } from "react-redux";
import BoardCard from "./BoardCard";
import { setAllPrimaryBoards } from "@/features/slice/userSession/userSessionSlice";
import CreateBoardCard from "./CreateBoardCard";
import { useEffect, useState } from "react";
import { DashboardContext } from "@/lib/dashboardContext";
import { sidebarItems } from "@/lib/constants";

export default function AllPrimaryBoardsView() {
  console.log("in all primary boards view");
  const dispatch = useDispatch();
  const [selectedView, setSelectedView] = useState(sidebarItems[1]);
  const { data: primaryBoards, isLoading, isFetching } = useGetAllPrimaryBoardsQuery();

  useEffect(() => {
    if (primaryBoards) {
      dispatch(setAllPrimaryBoards(primaryBoards));
    }
  }, [primaryBoards, dispatch]);

  return (
    <div className="flex flex-col w-full h-full gap-3">
      <CreateBoardCard />
      {isLoading || isFetching ? <div>Loading...</div> : <div className="flex flex-wrap gap-4">
        {primaryBoards &&
          primaryBoards.map((board) =>
            board.primaryBoard ? (
              <DashboardContext.Provider
                key={board.id}
                value={{ selectedView, setSelectedView }}
              >
                <BoardCard boardMetadata={board} />
              </DashboardContext.Provider>
            ) : null
          )}
      </div>}
    </div>
  );
}
