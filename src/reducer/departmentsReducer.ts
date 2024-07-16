import axiosClient from "@/apis/axiosClient";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  departments: [],
  isLoading: false,
  error: null,
  success: false,
};

export const fetchDepartments = createAsyncThunk(
  "departments/fetchDepartments",
  async (_, thunkAPI) => {
    try {
      const response = await axiosClient.get("/departments");
      return response.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

const departmentsSlice = createSlice({
  name: "departments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDepartments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.departments = action.payload;
        state.success = true;
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as any;
        state.success = false;
      });
  },
});

export default departmentsSlice.reducer;
