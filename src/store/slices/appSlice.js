import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  user: "ankit",
  theme: "light",
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
});

export const { toggleTheme, setUser } = appSlice.actions;
export default appSlice.reducer;
