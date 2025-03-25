import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signIn: (state, action) => ({
      ...state,
      token: action.payload,
      isAuthenticated: true,
    }),
    signOut: () => ({
      token: null,
      isAuthenticated: false,
    }),
  },
});

export const { signIn, signOut } = authSlice.actions;
export default authSlice.reducer;
