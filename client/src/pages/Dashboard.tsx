import { useState } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import { DashboardContext } from "@/lib/dashboardContext";
import { useParams, useSearchParams } from "react-router-dom";
import BoardView from "@/components/BoardView";
import { sidebarItems } from "@/lib/constants";
import ProfileHeader from "@/components/ProfileHeader";
import { useGetHomeBoardQuery } from "@/features/api/board-api";
import { useDispatch } from "react-redux";
import { setAllPrimaryBoards, setHomeBoard } from "@/features/slice/userSession/userSessionSlice";
import AllPrimaryBoardsView from "@/components/AllPrimaryBoardsView";
import CalendarView from "@/components/CalendarView";

export default function Dashboard() {
  const param = useParams();
  const [query] = useSearchParams();
  const dispatch = useDispatch();
  const {
    data: homeBoard,
    isFetching,
    isLoading,
  } = useGetHomeBoardQuery({
    isPrimary: true,
    isHome: true,
  });

  if (homeBoard) {
    dispatch(setHomeBoard(homeBoard))
    dispatch(setAllPrimaryBoards([homeBoard.kanbanBoard]))
  };

  console.log("home board view", homeBoard);

  // if (param?.boards)
  //   console.log("user requested to show all boards -> ", param.boards);

  // const boardId = query.get("board");
  // if (boardId) console.log("user requested board ->", boardId);

  const [selectedView, setSelectedView] = useState(sidebarItems[0]);

  return (
    <div className="flex flex-col h-full w-screen bg-secondary-black">
      <ProfileHeader />
      <div className="flex h-full w-full">
        <DashboardContext.Provider value={{ selectedView, setSelectedView }}>
          <DashboardSidebar sidebarItems={sidebarItems} />
        </DashboardContext.Provider>

        <section className="flex h-screen w-full bg-orange-100 rounded-tl-2xl p-3">
          {isLoading || isFetching ? (
            <div className="flex">Loading...</div>
          ) : (
            <div className="flex">
              <div className="h-full w-5 bg-red-500 mr-3"></div>
              {(!param.view || param.view === "") && homeBoard && <BoardView />}
              {param.view === "boards" && <AllPrimaryBoardsView />}
              {param.view === "calendar" && <CalendarView />}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
