export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  avatar?: string;
  roles: string[];
  permissions: string[];
  createdAt: string;
  updatedAt: string;
  lastLogin: string;
}

export interface UserState {
  currentUser: User | undefined;
  isLoading: boolean;
  success: boolean;
  message: string;
  error: string | null;
}
