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

      return response.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (userData: any, thunkAPI) => {
    try {
      const data = JSON.stringify(userData);

      const response = await axiosClient.post("/auth/login", data);

      return response.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchUser = createAsyncThunk(
  "auth/fetchUser",
  async (_, thunkAPI) => {
    try {
      const response = await axiosClient.get("/auth/user");

      return response.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const signout = createAsyncThunk("auth/signout", async (_, thunkAPI) => {
  try {
    const response = await axiosClient.post("/auth/signout");
    localStorage.removeItem("accessToken");

    return response.data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});

export const logInWithGoogle = createAsyncThunk(
  "auth/logInWithGoogle",
  async (userData: any, thunkAPI) => {
    try {
      const data = JSON.stringify(userData);
      const response = await axiosClient.post("/auth/logInWithGoogle", data);

      return response.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

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
        return response.data;
      }
    } catch (err: any) {
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
        state.currentUser = action.payload.data;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.success = false;
        state.message = "Update profile failed";
      });
  },
});

export default authSlice.reducer;
