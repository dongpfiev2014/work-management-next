export interface User {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  avatar: string;
  roles: string[];
  permissions: string[];
  createdAt: string;
  updatedAt: string;
  lastLogin: string;
  address: string;
  telephoneNumber: string;
  gender: string;
  dateOfBirth: string;
  companyId: [
    {
      id: string;
      name: string;
      // industry: string;
      // size: string;
      // employees: number;
      // website: string;
      // description: string;
      // logo?: string;
      // createdAt: string;
      // updatedAt: string;
      // userId: string;
    }
  ];
  jobTitle: string;
}

export interface UserState {
  currentUser: User | undefined;
  isLoading: boolean;
  success: boolean;
  message: string;
  error: string | null;
}
