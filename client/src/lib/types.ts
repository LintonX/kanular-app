export type SidebarItem = {
  name: string;
  path: string;
};

export type DashboardContextType = {
  selectedItem: SidebarItem;
  setSelectedItem: React.Dispatch<React.SetStateAction<SidebarItem>>;
};

export type Column = {
  id: string;
  title: string;
  index: number;
};
