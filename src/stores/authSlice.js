import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.data = action.payload;
      state.isAuthenticated = true;
    },
    setAuthUser: (state, action) => {
      if (!state.data) {
        state.data = {
          user: action.payload,
          token: localStorage.getItem('token') || null,
        };
        state.isAuthenticated = true;
      } else {
        state.data.user = action.payload;
      }
    },
    logout: (state) => {
      state.data = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    },
  },
});

export const { login, logout, setAuthUser } = authSlice.actions;
export default authSlice.reducer;