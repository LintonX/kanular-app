import { SidebarItem } from "@/lib/types";
import { Link } from "react-router-dom";
import { Separator } from "./ui/separator";
import { useDispatch, useSelector } from "react-redux";
import {
  selectUserSidebar,
  setSelectedView,
} from "@/features/slice/userSidebar/userSidebarSlice";
import React from "react";
import { SIDEBAR_ITEMS } from "@/lib/constants";

export default function DashboardSidebar({
  sidebarItems,
}: {
  sidebarItems: SidebarItem[];
}) {
  const dispatch = useDispatch();
  const userSidebar = useSelector(selectUserSidebar);

  return (
    <div className="w-64 min-w-64 h-auto bg-secondary-black text-white px-7 pb-7">
      <div className="flex flex-col">
        <h1 className="text-3xl font-semibold">Dashboard</h1>
        <div className="flex flex-col mt-16">
          <ul className="list-none w-full">
            {sidebarItems.map((item, index) => (
              <React.Fragment key={item.name}>
                <Link to={item.path}>
                  <li
                    onClick={() => dispatch(setSelectedView(item))}
                    className={`px-4 py-2 w-full text-lg mb-2 rounded-lg border-1 border-transparent ${
                      item.name === userSidebar.selectedView.name
                        ? "bg-primary-blue transform ease-in-out duration-300 border-white/70"
                        : ""
                    }`}
                  >
                    {item.name}
                  </li>
                </Link>
                {index === SIDEBAR_ITEMS.length - 1 && <Separator className="opacity-20 mb-2" />}
              </React.Fragment>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
