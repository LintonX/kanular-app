import { useDashboardContext } from "@/lib/dashboardContext";
import { SidebarItem } from "@/lib/types";
import { Link } from "react-router-dom";
import { Separator } from "./ui/separator";

export default function DashboardSidebar({
  sidebarItems,
}: {
  sidebarItems: SidebarItem[];
}) {
  const dashboardContext = useDashboardContext();
  const selectedView = dashboardContext.selectedView;
  const setSelectedView = dashboardContext.setSelectedView;

  return (
    <div className="w-64 min-w-64 h-auto bg-secondary-black text-white px-7 pb-7">
      <div className="flex flex-col">
        <h1 className="text-3xl font-semibold">Dashboard</h1>
        <div className="flex flex-col mt-16">
          <ul className="list-none w-full">
            {sidebarItems.map((item) => (
              <Link key={item.name} to={item.path}>
                <li
                  onClick={() => setSelectedView(item)}
                  className={`px-4 py-2 w-full text-lg mb-2 rounded-lg border-1 border-transparent ${
                    item.name === selectedView.name
                      ? "bg-primary-blue transform ease-in-out duration-300 border-white/70"
                      : ""
                  }`}
                >
                  {item.name}
                </li>
              </Link>
            ))}
          </ul>
          <Separator className="opacity-20" />
        </div>
      </div>
    </div>
  );
}
