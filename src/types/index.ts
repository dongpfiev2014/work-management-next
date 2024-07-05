export interface User {
  id: string;
  fullName: string;
  email: string;
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
