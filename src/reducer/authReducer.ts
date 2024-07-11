import axiosClient from "@/apis/axiosClient";
import { UserState } from "@/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState: UserState = {
  currentUser: undefined,
  isLoading: false,
  success: false,
  message: "",
  error: null,
};

export const register = createAsyncThunk(
  "auth/register",
  async (userData: any, thunkAPI) => {
    try {
      const data = JSON.stringify(userData);
      const response = await axiosClient.post("/auth/signup", data);
      console.log(response.data);
      return response.data;
    } catch (err: any) {
      console.log(err.response);
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (userData: any, thunkAPI) => {
    try {
      const data = JSON.stringify(userData);
      console.log(data);
      const response = await axiosClient.post("/auth/login", data);
      console.log(response.data);
      return response.data;
    } catch (err: any) {
      console.log(err.response);
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchUser = createAsyncThunk(
  "auth/fetchUser",
  async (_, thunkAPI) => {
    try {
      const response = await axiosClient.get("/auth/user");
      console.log(response.data);
      return response.data;
    } catch (err: any) {
      console.log(err.response);
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const signout = createAsyncThunk("auth/signout", async (_, thunkAPI) => {
  try {
    const response = await axiosClient.post("/auth/signout");
    localStorage.removeItem("accessToken");
    console.log(response.data);
    return response.data;
  } catch (err: any) {
    console.log(err.response);
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});

export const logInWithGoogle = createAsyncThunk(
  "auth/logInWithGoogle",
  async (userData: any, thunkAPI) => {
    try {
      const data = JSON.stringify(userData);
      const response = await axiosClient.post("/auth/logInWithGoogle", data);
      console.log(response.data);
      return response.data;
    } catch (err: any) {
      console.log(err.response);
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
    builder
      .addCase(signout.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signout.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentUser = action.payload.data;
        state.message = action.payload.message;
        state.success = true;
        state.error = null;
      })
      .addCase(signout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.success = true;
        state.currentUser = undefined;
        state.message = "";
      });
    builder
      .addCase(logInWithGoogle.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logInWithGoogle.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentUser = action.payload.data;
        state.message = action.payload.message;
        state.success = true;
      })
      .addCase(logInWithGoogle.rejected, (state, action) => {
        state.isLoading = false;
        state.message = "Registration failed";
        state.error = action.payload as string;
        state.success = false;
      });
  },
});

export default authSlice.reducer;
