import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { isTokenValide } from "../utils/token";

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  username: string | null;
}

const initialState: AuthState = {
  token: null,
  isAuthenticated: false,
  isLoading: false,
  username: null,
};

interface LoginPayload {
  token: string;
  username: string;
  cartCount?: number;
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<LoginPayload>) => {
      const { token, username } = action.payload;
      state.token = token;
      state.isAuthenticated = isTokenValide(token);
      state.username = username;
    },
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.username = null;
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
