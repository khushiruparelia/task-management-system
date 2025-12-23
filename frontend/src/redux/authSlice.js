import { createSlice } from "@reduxjs/toolkit";

const user = JSON.parse(localStorage.getItem('user'));

const initialState = {
  isLoggedIn: user !== null,
  user: user ? user : null,
};

const authReducer = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      state.user = action.payload; 
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
    },
  },
});

export const { login, logout } = authReducer.actions;
export default authReducer.reducer;