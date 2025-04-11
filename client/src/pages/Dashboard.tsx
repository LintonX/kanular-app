import { useEffect, useState } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import { DashboardContext } from "@/lib/dashboardContext";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import BoardView from "@/components/Board/BoardView";
import AllBoardsView from "@/components/AllBoardsView";
import { sidebarItems } from "@/lib/constants";
import { useUserSessionQuery } from "@/features/api/auth-api";


export default function Dashboard() {
  const navigate = useNavigate();
  const param = useParams();
  const [query] = useSearchParams();
  // const { data, isSuccess, isLoading, isError, error, isUninitialized } = useUserSessionQuery();
  const result = useUserSessionQuery();

  console.log("in dashboard",result);

  if (param?.boards)
    console.log("user requested to show all boards -> ", param.boards);

  const boardId = query.get("board");
  if (boardId) console.log("user requested board ->", boardId);

  const [selectedItem, setSelectedItem] = useState(sidebarItems[0]);

  if (result.isLoading || !result.data) {
    return <div>Loading...</div>;
  }

  console.log("reloaded");

  return (
    <div className="flex h-full pt-3">
      <DashboardContext.Provider value={{ selectedItem, setSelectedItem }}>
        <DashboardSidebar sidebarItems={sidebarItems} />
      </DashboardContext.Provider>

      <section className="flex flex-col h-screen w-full bg-orange-200 ">
        <span>Static - {selectedItem.name}</span>
        {boardId && <BoardView boardId={boardId} />}
        {param?.boards && <AllBoardsView />}
      </section>
    </div>
  );
}
