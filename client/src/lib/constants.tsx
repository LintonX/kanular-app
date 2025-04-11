import { Column, SidebarItem } from "./types";

const ACTIVE_BOARD = "Active Board";
const BOARDS = "Boards";
const CALENDAR = "Calendar";
export const AUTH_DASHBOARD = "/auth/dashboard";

export const sidebarItems: SidebarItem[] = [
  { name: ACTIVE_BOARD, path: AUTH_DASHBOARD + "?board=1234" },
  { name: BOARDS, path: AUTH_DASHBOARD + "/boards" },
  { name: CALENDAR, path: AUTH_DASHBOARD + "/calendar" },
];

export const columns: Column[] = [
  { id: "todo", title: "To Do", index: 0 },
  { id: "inProgress", title: "In Progress", index: 1 },
  { id: "review", title: "In Review", index: 2 },
  { id: "Completed", title: "Completed", index: 3 },
];