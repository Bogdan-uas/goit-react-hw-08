import { RootState } from "../store";

export const selectIsLoggedIn = (state: RootState): boolean => state.auth.isLoggedIn;

export const selectIsRefreshing = (state: RootState): boolean => state.auth.isRefreshing;

export const selectUser = (state: RootState) => state.auth.user;

export const selectToken = (state: RootState): string | null => state.auth.token;