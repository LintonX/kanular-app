import { clsx, type ClassValue } from "clsx";
import { Slide, toast } from "react-toastify";
import { twMerge } from "tailwind-merge";
import { SIDEBAR_ITEMS, STAGE_LABELS } from "./constants";
import { SidebarItem } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const toastNotifyError = (errorMessage: string) => {
  toast.error(
    errorMessage,
    {
      position: "bottom-center",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      progress: undefined,
      theme: "light",
      transition: Slide,
    }
  );
};

export const getStage = (stage: string) => {
  return STAGE_LABELS[stage];
}

export const getSidebarItems = (additionalItems: SidebarItem[] = []) => {
  return [
    ...SIDEBAR_ITEMS,
    ...additionalItems,
  ];
};