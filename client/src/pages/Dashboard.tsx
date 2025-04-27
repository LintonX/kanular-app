import DashboardSidebar from "@/components/DashboardSidebar";
import BoardView from "@/components/BoardView";
import ProfileHeader from "@/components/ProfileHeader";
import AllPrimaryBoardsView from "@/components/AllPrimaryBoardsView";
import CalendarView from "@/components/CalendarView";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUserSidebar } from "@/features/slice/userSidebar/userSidebarSlice";
import { selectUserSession } from "@/features/slice/userSession/userSessionSlice";

export default function Dashboard() {
  const param = useParams();
  const userSession = useSelector(selectUserSession);
  const userSidebar = useSelector(selectUserSidebar);

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
