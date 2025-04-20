import DashboardSidebar from "@/components/DashboardSidebar";
import { DashboardContext } from "@/lib/dashboardContext";
import { useParams, useSearchParams } from "react-router-dom";
import BoardView from "@/components/BoardView";
import { sidebarItems } from "@/lib/constants";
import ProfileHeader from "@/components/ProfileHeader";
import { useGetHomeBoardQuery } from "@/features/api/board-api";
import { useDispatch } from "react-redux";
import {
  setAllPrimaryBoards,
  setHomeBoard,
} from "@/features/slice/userSession/userSessionSlice";
import AllPrimaryBoardsView from "@/components/AllPrimaryBoardsView";
import CalendarView from "@/components/CalendarView";
import { useState } from "react";
import HomeBoardView from "@/components/HomeBoardView";

export default function Dashboard() {
  const param = useParams();
  const [query] = useSearchParams();

  const [selectedView, setSelectedView] = useState(sidebarItems[0]);

  return (
    <div className="flex flex-col h-full w-screen bg-secondary-black">
      <ProfileHeader />
      <div className="flex h-full w-full">
        <DashboardContext.Provider value={{ selectedView, setSelectedView }}>
          <DashboardSidebar sidebarItems={sidebarItems} />
        </DashboardContext.Provider>

        <section className="flex h-screen w-full bg-primary-white rounded-tl-xl p-3 border-t-1 border-l-1 border-white">
          <div className="flex">
            {(!param.view || param.view === "") && <HomeBoardView />}
            {param.view === "boards" && <AllPrimaryBoardsView />}
            {param.view === "calendar" && <CalendarView />}
          </div>
        </section>
      </div>
    </div>
  );
}
