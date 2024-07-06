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

const baseUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}:${process.env.NEXT_PUBLIC_SERVER_PORT}/${process.env.NEXT_PUBLIC_VERSION}`;

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
      console.log(response.data);
      return response.data;
    } catch (err: any) {
      console.log(err.response?.data);
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (userData: any, thunkAPI) => {
    try {
      const data = JSON.stringify(userData);
      const config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${baseUrl}/auth/login`,
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };
      const response = await axios.request(config);
      console.log(response.data);
      return response.data;
    } catch (err: any) {
      console.log(err.response?.data);
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
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
      console.log(response.data);
      return response.data;
    } catch (err: any) {
      console.log(err.response?.data);
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const signout = createAsyncThunk(
  "auth/signout",
  async (accessToken: string, thunkAPI) => {
    try {
      localStorage.removeItem("accessToken");
      const config = {
        method: "post",
        url: `${baseUrl}/auth/signout`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const response = await axios.request(config);
      console.log(response.data);
      return response.data;
    } catch (err: any) {
      console.log(err.response?.data);
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
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
        state.currentUser = action.payload.data;
        state.message = action.payload.message;
        state.success = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.message = "Registration failed";
        state.error = action.payload as string;
        state.success = false;
      });
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentUser = action.payload.data;
        state.message = action.payload.message;
        state.success = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.message = "Login failed";
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
        state.currentUser = action.payload.data;
        state.message = action.payload.message;
        state.success = true;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.isLoading = false;
        state.message = "Fetching user failed";
        state.error = action.payload as string;
        state.success = false;
      });
    builder.addCase(signout.fulfilled, (state) => {
      state = initialState;
    });
  },
});

export default authSlice.reducer;
