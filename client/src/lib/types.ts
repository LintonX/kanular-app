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

export type UserSession = {
  userAccountDto: UserAccountDto;
  isAuthenticated: boolean;
  jwt: string;
}