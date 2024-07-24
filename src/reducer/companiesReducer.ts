import axiosClient from "@/apis/axiosClient";
import { CompanyState } from "@/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState: CompanyState = {
  companies: [],
  isLoading: false,
  error: null,
  message: "",
  success: false,
};

export const fetchCompanies = createAsyncThunk(
  "companies/fetchCompanies",
  async (userId: any, thunkAPI) => {
    try {
      const response = await axiosClient.get(`/company/${userId}`);
      return response.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

const companiesSlice = createSlice({
  name: "companies",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanies.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.isLoading = false;
        state.companies = action.payload.data;
        state.message = action.payload.message;
        state.success = true;
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.isLoading = false;
        state.message = "Fetching companies failed";
        state.error = action.payload as string;
        state.success = false;
        state.companies = [];
      });
  },
});

export default companiesSlice.reducer;
