import DashboardSidebar from "@/components/DashboardSidebar";
import { useParams, useSearchParams } from "react-router-dom";
import BoardView from "@/components/BoardView";
import ProfileHeader from "@/components/ProfileHeader";
import AllPrimaryBoardsView from "@/components/AllPrimaryBoardsView";
import CalendarView from "@/components/CalendarView";
import HomeBoardView from "@/components/HomeBoardView";
import { useSelector } from "react-redux";
import { selectUserSidebar } from "@/features/slice/userSidebar/userSidebarSlice";
import { selectUserSession } from "@/features/slice/userSession/userSessionSlice";
import LoadingBoard from "@/components/LoadingBoard";

export default function Dashboard() {
  const param = useParams();
  const [query] = useSearchParams();
  const userSession = useSelector(selectUserSession);
  const userSidebar = useSelector(selectUserSidebar);

  console.log("SIDEBAR STATEeeeeeeeeeeeeee", userSidebar);
  const queriedBoardId = query.get("board");

  return (
    <div className="flex flex-col h-full w-screen bg-secondary-black">
      <ProfileHeader />
      <div className="flex h-full w-full">
        <DashboardSidebar sidebarItems={userSidebar.sidebarItems} />
        <section className="flex h-screen w-full bg-primary-white rounded-tl-xl p-3 border-t-1 border-l-1 border-white">
          <div className="flex">
            {(() => {
              if (param.view === "boards") return <AllPrimaryBoardsView />;
              if (param.view === "calendar") return <CalendarView />;
              if (!param.view || param.view === "") return <BoardView boardId={userSession.activeBoardId} />;
              return null;
            })()}
          </div>
        </section>
      </div>
    </div>
  );
}
