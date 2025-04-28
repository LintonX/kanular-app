import { SidebarItem, Stage } from "./types";

export const ACTIVE_BOARD = "Active Board";
export const BOARDS = "Boards";
export const CALENDAR = "Calendar";
export const AUTH_DASHBOARD = "/auth/dashboard";

export const SIDEBAR_ITEMS: SidebarItem[] = [
  { name: ACTIVE_BOARD, path: AUTH_DASHBOARD },
  { name: BOARDS, path: `${AUTH_DASHBOARD}/boards` },
  { name: CALENDAR, path: `${AUTH_DASHBOARD}/calendar` },
];

export const STAGE_LABELS: Record<string, string> = {
  ["TO_DO"]: "To Do",
  ["IN_PROGRESS"]: "In Progress",
  ["IN_REVIEW"]: "In Review",
  ["DONE"]: "Done",
};

export const STAGE_COLUMNS: string[] = Object.keys(STAGE_LABELS);