import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: AdminUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem('admin_user') || 'null'),
  accessToken: localStorage.getItem('admin_token'),
  isAuthenticated: !!localStorage.getItem('admin_token'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: AdminUser; accessToken: string }>) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      localStorage.setItem('admin_user', JSON.stringify(action.payload.user));
      localStorage.setItem('admin_token', action.payload.accessToken);
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem('admin_user');
      localStorage.removeItem('admin_token');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
