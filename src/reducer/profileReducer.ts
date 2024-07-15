import axiosClient from "@/apis/axiosClient";
import { ProfileState } from "@/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState: ProfileState = {
  currentProfile: undefined,
  isLoading: false,
  success: false,
  message: "",
  error: null,
};

export const updateProfile = createAsyncThunk(
  "profile/update",
  async (userData: any, thunkAPI) => {
    try {
      const { id, updatedProfile, avatarFile } = userData;
      const formData = new FormData();
      formData.append("updatedProfile", JSON.stringify(updatedProfile));
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }
      const response = await axiosClient.put(`/profile/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response && response.status === 200 && response.data) {
        console.log(response.data);
        return response.data;
      }
    } catch (err: any) {
      console.log(err.response);
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.message = action.payload.message;
        state.currentProfile = action.payload.data;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.success = false;
        state.message = "";
      });
  },
});

export default profileSlice.reducer;
