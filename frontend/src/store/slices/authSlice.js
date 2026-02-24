import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";
import { showError, showSuccess } from "../../utils/toast";

const AUTH_STORAGE_KEY = "authState";

const loadStoredAuth = () => {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) {
    return {
      user: null,
      token: null,
    };
  }

  try {
    const parsed = JSON.parse(raw);
    return {
      user: parsed.user || null,
      token: parsed.token || null,
    };
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return {
      user: null,
      token: null,
    };
  }
};

const persistAuth = (state) => {
  localStorage.setItem(
    AUTH_STORAGE_KEY,
    JSON.stringify({
      user: state.user,
      token: state.token,
    }),
  );
};

export const signupUser = createAsyncThunk(
  "auth/signup",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/signup", formData);
      showSuccess(response.data.message || "Signup successful!");
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Signup failed";
      showError(message);
      return rejectWithValue(message);
    }
  },
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/login", formData);
      showSuccess("Login successful!");
      return response.data; // contains token and user
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      showError(message);
      return rejectWithValue(message);
    }
  },
);

const storedAuth = loadStoredAuth();

const initialState = {
  user: storedAuth.user,
  token: storedAuth.token,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem(AUTH_STORAGE_KEY);
      showSuccess("Logged out successfully");
    },
  },
  extraReducers: (builder) => {
    builder
      // Signup
      .addCase(signupUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        persistAuth(state);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
