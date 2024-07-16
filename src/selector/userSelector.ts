import { RootState } from "@/store/store";

export const userInfo = (state: RootState) => state.auth;
export const companiesList = (state: RootState) => state.companies;
