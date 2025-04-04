import { useState } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import { DashboardContext } from "@/lib/dashboardContext";
import { useParams, useSearchParams } from "react-router-dom";
import BoardView from "@/components/BoardView";
import AllBoardsView from "@/components/AllBoardsView";
import { sidebarItems } from "@/lib/constants";

export default function Dashboard() {
  const param = useParams();
  const [query] = useSearchParams();

  if (param?.boards)
    console.log("user requested to show all boards -> ", param.boards);

  const boardId = query.get("board");
  if (boardId) console.log("user requested board ->", boardId);

  const [selectedItem, setSelectedItem] = useState(sidebarItems[0]);
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
