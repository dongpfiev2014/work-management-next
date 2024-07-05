import { UserState } from "@/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState: UserState = {
  currentUser: undefined,
  isLoading: false,
  success: false,
  message: "",
  error: null,
};

const baseUrl = process.env.SERVER_URL;

export const register = createAsyncThunk(
  "auth/register",
  async (userData: any, thunkAPI) => {
    try {
      const data = JSON.stringify(userData);
      const config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${baseUrl}/auth/signup`,
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };
      const response = await axios.request(config);
      console.log(JSON.stringify(response.data));
      return response.data;
    } catch (err: any) {
      // return thunkAPI.rejectWithValue(
      //   err.response?.data?.errors || err.message
      // );
      console.log(err);
    }
  }
);

export const fetchUser = createAsyncThunk(
  "auth/fetchUser",
  async (accessToken: string, thunkAPI) => {
    try {
      const config = {
        method: "get",
        url: `${baseUrl}/auth/user`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const response = await axios.request(config);
      return response.data;
    } catch (err: any) {
      // return thunkAPI.rejectWithValue(
      //   err.response?.data?.errors || err.message
      // );
      console.log(err);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentUser = action.payload;
        state.success = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.error.message || "Registration failed";
        state.error = action.payload as string;
        state.success = false;
      });
    builder
      .addCase(fetchUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentUser = action.payload;
        state.success = true;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.error.message || "Fetching user failed";
        state.error = action.payload as string;
        state.success = false;
      });
  },
});

export default authSlice.reducer;
