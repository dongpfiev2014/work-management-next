import { RootState } from "@/store/store";

export const userInfo = (state: RootState) => state.auth;
export const profileInfo = (state: RootState) => state.profile;
