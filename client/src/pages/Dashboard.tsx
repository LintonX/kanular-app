import { useState } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import { DashboardContext } from "@/lib/dashboardContext";
import { useParams, useSearchParams } from "react-router-dom";
import BoardView from "@/components/Board/BoardView";
import AllBoardsView from "@/components/AllBoardsView";
import { sidebarItems } from "@/lib/constants";
import ProfileHeader from "@/components/ProfileHeader";

export default function Dashboard() {
  const param = useParams();
  const [query] = useSearchParams();
  // const { data, isSuccess, isLoading, isError, error, isUninitialized } = useUserSessionQuery();

  if (param?.boards)
    console.log("user requested to show all boards -> ", param.boards);

  const boardId = query.get("board");
  if (boardId) console.log("user requested board ->", boardId);

  const [selectedItem, setSelectedItem] = useState(sidebarItems[0]);

  console.log("reloaded");

  return (
    <div className="flex flex-col h-full w-screen bg-secondary-black">
      <ProfileHeader />
      <div className="flex h-full w-full">
        <DashboardContext.Provider value={{ selectedItem, setSelectedItem }}>
          <DashboardSidebar sidebarItems={sidebarItems} />
        </DashboardContext.Provider>
        <section className="flex h-screen w-full bg-orange-100 rounded-tl-2xl p-3">
          <div className="flex">
            <div className="h-full w-5 bg-red-500 mr-3"></div>
            <div>
              Static - {selectedItem.name}
              {boardId && <BoardView boardId={boardId} />}
              {param?.boards && <AllBoardsView />}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
