import { SidebarItem } from "./types";

const ACTIVE_BOARD = "Active Board";
const BOARDS = "Boards";
const CALENDAR = "Calendar";
export const AUTH_DASHBOARD = "/auth/dashboard";

export const sidebarItems: SidebarItem[] = [
  { name: ACTIVE_BOARD, path: AUTH_DASHBOARD + "?board=1234" },
  { name: BOARDS, path: AUTH_DASHBOARD + "/boards" },
  { name: CALENDAR, path: AUTH_DASHBOARD + "/calendar" },
];

export const stageLabels: Record<string, string> = {
  ["TO_DO"]: "To Do",
  ["IN_PROGRESS"]: "In Progress",
  ["IN_REVIEW"]: "In Review",
  ["DONE"]: "Done",
};