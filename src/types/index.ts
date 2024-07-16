export interface User {
  _id: string;
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
  companies: [
    {
      _id: string;
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

export interface Companies {
  _id: string;
  owner: string;
  organizationName: string;
  address: string;
  email: string;
  phoneNumber: string;
  industry: string;
  website: string;
  employees: [string];
  description: string;
  companyLogo: string;
  department: [string];
}

export interface CompanyState {
  companies: Companies[] | undefined;
  isLoading: boolean;
  success: boolean;
  message: string;
  error: string | null;
}
