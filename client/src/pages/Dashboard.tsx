import { useState } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import { DashboardContext } from "@/lib/dashboardContext";
import { useParams, useSearchParams } from "react-router-dom";
import BoardView from "@/components/BoardView";
import { sidebarItems } from "@/lib/constants";
import ProfileHeader from "@/components/ProfileHeader";
import { useHydrateDashboardQuery } from "@/features/api/board-api";
import { useDispatch } from "react-redux";
import { setHydrateDashboard } from "@/features/slice/userSession/userSessionSlice";

export default function Dashboard() {
  const param = useParams();
  const [query] = useSearchParams();
  const dispatch = useDispatch();
  const {data, isError, isFetching} = useHydrateDashboardQuery();

  if (data) dispatch(setHydrateDashboard(data))

  console.log("HYDRATED DASHBOARD VIEW", data);

  // if (param?.boards)
  //   console.log("user requested to show all boards -> ", param.boards);

  // const boardId = query.get("board");
  // if (boardId) console.log("user requested board ->", boardId);

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
              {data?.homeBoard &&  <BoardView completeBoard={data.homeBoard} />}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
