import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface WorkerUser {
  id: string;
  name: string;
  email: string;
  storeId: string;
}

interface AuthState {
  worker: WorkerUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = { worker: null, accessToken: null, isAuthenticated: false };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ worker: WorkerUser; accessToken: string; refreshToken: string }>) => {
      state.worker = action.payload.worker;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      AsyncStorage.setItem('worker_accessToken', action.payload.accessToken);
      AsyncStorage.setItem('worker_refreshToken', action.payload.refreshToken);
    },
    logout: (state) => {
      state.worker = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      AsyncStorage.multiRemove(['worker_accessToken', 'worker_refreshToken']);
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
