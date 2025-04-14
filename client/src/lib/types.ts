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
  homeBoard: CompleteKanbanBoard;
  primaryBoardsMetadata: KanbanBoard[];
  viewedBoards: CompleteKanbanBoard[];
}

export type CompleteKanbanBoard = {
  kanbanBoard: KanbanBoard;
  kanbanColumns: KanbanColumn[];
  kanbanCards: KanbanCard[]
}

export type KanbanBoard = {
  id?: string;
  parentId?: string; 
  homeBoard?: boolean;
  primaryBoard?: boolean;
  title?: string;
}

export type KanbanColumn = {
  id?: string;
  parentId?: string;
  stage?: Stage; // TO_DO, IN_PROGRESS, IN_REVIEW, DONE
}

export type KanbanCard = {
  id?: string;
  parentId?: string;
  title?: string;
  body?: string;
  stage?: Stage; // TO_DO, IN_PROGRESS, IN_REVIEW, DONE
  hasChildBoard?: boolean;
}

export enum Stage {
  TO_DO = "To Do",
  IN_PROGRESS = "In Progress",
  IN_REVIEW = "In Review",
  DONE = "Done"
}