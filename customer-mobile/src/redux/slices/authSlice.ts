import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CustomerUser {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: CustomerUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  selectedStoreId: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  selectedStoreId: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: CustomerUser; accessToken: string; refreshToken: string }>
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      AsyncStorage.setItem('accessToken', action.payload.accessToken);
      AsyncStorage.setItem('refreshToken', action.payload.refreshToken);
    },
    setStore: (state, action: PayloadAction<string>) => {
      state.selectedStoreId = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
    },
  },
});

export const { setCredentials, setStore, logout } = authSlice.actions;
export default authSlice.reducer;
