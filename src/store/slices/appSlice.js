import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";
import { showError, showInfo, showSuccess } from "../../utils/toast";

export const fetchUsers = createAsyncThunk(
  "app/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      showInfo("Fetching users...");
      const response = await api.get("/users");
      showSuccess("Users loaded successfully!");
      return response.data;
    } catch (error) {
      showError("Failed to fetch users");
      return rejectWithValue(error.message);
    }
  },
);

const initialState = {
  user: "ankit",
  theme: "light",
  users: [],
  isLoading: false,
  error: null,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { toggleTheme, setUser } = appSlice.actions;
export default appSlice.reducer;
