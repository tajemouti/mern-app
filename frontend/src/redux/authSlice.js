import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  user: JSON.parse(localStorage.getItem('user')) || null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signIn: (state, action) => {
      const { token, user } = action.payload;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      return {
        ...state,
        token,
        isAuthenticated: true,
        user,
      };
    },
    signOut: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return {
        token: null,
        isAuthenticated: false,
        user: null,
      };
    },
  },
});

export const { signIn, signOut } = authSlice.actions;
export default authSlice.reducer;
