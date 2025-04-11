import { useDashboardContext } from "@/lib/dashboardContext";
import { SidebarItem } from "@/lib/types";
import { Link } from "react-router-dom";

export default function DashboardSidebar({
  sidebarItems,
}: {
  sidebarItems: SidebarItem[];
}) {
  const dashboardContext = useDashboardContext();
  const selectedItem = dashboardContext.selectedItem;
  const setSelectedItem = dashboardContext.setSelectedItem;

  return (
    <div className="w-64 min-w-64 h-auto bg-secondary-black text-white px-7 pb-7">
      <div className="flex flex-col">
        <h1 className="text-3xl font-semibold">Dashboard</h1>
        <div className="flex mt-16">
          <ul className="list-none w-full">
            {sidebarItems.map((item) => (
              <Link key={item.name} to={item.path}>
                <li
                  onClick={() => setSelectedItem(item)}
                  className={`px-4 py-2 w-full text-lg mb-2 rounded-lg ${
                    item.name === selectedItem.name
                      ? "bg-primary-blue transform ease-in-out duration-400"
                      : ""
                  }`}
                >
                  {item.name}
                </li>
              </Link>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
