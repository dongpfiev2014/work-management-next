import axiosClient from "@/apis/axiosClient";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface Project {
  id: string;
  name: string;
  description: string;
  // Các trường dữ liệu khác của project
}

interface ProjectsState {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: ProjectsState = {
  projects: [],
  isLoading: false,
  error: null,
  success: false,
};

export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async (_, thunkAPI) => {
    try {
      const response = await axiosClient.get("/projects");
      return response.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const addProject = createAsyncThunk(
  "projects/addProject",
  async (projectData: Project, thunkAPI) => {
    try {
      const response = await axiosClient.post("/projects", projectData);
      return response.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects = action.payload;
        state.success = true;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.success = false;
      })
      .addCase(addProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects.push(action.payload);
        state.success = true;
      })
      .addCase(addProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.success = false;
      });
  },
});

export default projectsSlice.reducer;
