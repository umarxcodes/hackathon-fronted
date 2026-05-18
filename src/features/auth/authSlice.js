import { createSlice } from "@reduxjs/toolkit";
const storedToken = localStorage.getItem("clinic_token");
const token =
  storedToken && storedToken !== "undefined" && storedToken !== "null"
    ? storedToken
    : null;
const user = localStorage.getItem("clinic_user");
if (!token) localStorage.removeItem("clinic_token");
const initialState = {
  user: user ? JSON.parse(user) : null,
  token: token || null,
  isAuthenticated: !!token,
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = Boolean(token);
      if (token) localStorage.setItem("clinic_token", token);
      localStorage.setItem("clinic_user", JSON.stringify(user));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("clinic_token");
      localStorage.removeItem("clinic_user");
    },
  },
});
export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
