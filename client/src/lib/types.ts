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

export type LoginCredential = {
  email: string;
  password: string;
}

export type SignUpCredential = LoginCredential & {
  confirmPassword: string
}

export type UserAccountDto = {
  id: string;
  email: string;
}

export type UserSessionState = {
  userAccount: UserAccountDto;
  isAuth: boolean;
}

// export type KanbanBoard = {
//   id: string;
//   parentId: string; 
//   isPrimary: boolean;
// }

// export type KanbanColumn = {
//   id: string;
//   parentId: string;
//   stage: string; // TO_DO, IN_PROGRESS, IN_REVIEW, DONE
// }

// export type KanbanCard = {
//   id: string;
//   parentId: string;
//   title: string;
//   body: string;
//   stage: string; // TO_DO, IN_PROGRESS, IN_REVIEW, DONE
//   hasChildBoard: boolean;
// }