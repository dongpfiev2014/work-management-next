// src/joinRequestsSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
interface JoinRequest {
  userId: string;
  organizationId: string;
  position: string;
  reason: string;
  role: string;
  id: string;
}
interface JoinRequestsState {
  requests: JoinRequest[];
}
const initialState: JoinRequestsState = {
  requests: [],
};
const joinRequestsSlice = createSlice({
  name: "joinRequests",
  initialState,
  reducers: {
    addJoinRequest: (state, action: PayloadAction<JoinRequest>) => {
      state.requests.push(action.payload);
    },
    approveJoinRequest: (state, action: PayloadAction<{ id: string }>) => {
      state.requests = state.requests.filter(
        (req) => req.id !== action.payload.id
      );
    },
  },
});
export const { addJoinRequest, approveJoinRequest } = joinRequestsSlice.actions;
export default joinRequestsSlice.reducer;
