import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
    apiRegister,
    apiLogin,
    apiRefreshUser,
    apiLogout,
} from "./operations";

interface User {
    name: string | null;
    email: string | null;
}

interface AuthState {
    user: User;
    token: string | null;
    isLoggedIn: boolean;
    isRefreshing: boolean;
    loading?: boolean;
    error?: boolean | null;
}

export const INITIAL_STATE_AUTH: AuthState = {
user: {
    name: null,
    email: null,
},
    token: null,
    isLoggedIn: false,
    isRefreshing: false,
    loading: false,
    error: null,
};

const handlePending = (state: AuthState) => {
    state.loading = true;
    state.error = null;
};

const handleRejected = (state: AuthState) => {
    state.loading = false;
    state.error = true;
};

const authSlice = createSlice({
name: "auth",
initialState: INITIAL_STATE_AUTH,
reducers: {
},
extraReducers: (builder) => {
    builder
    .addCase(apiRegister.pending, handlePending)
    .addCase(apiRegister.fulfilled, (state, action: PayloadAction<{ user: User; token: string }>) => {
        state.loading = false;
        state.isLoggedIn = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
    })
    .addCase(apiRegister.rejected, handleRejected)
    .addCase(apiLogin.pending, handlePending)
    .addCase(apiLogin.fulfilled, (state, action: PayloadAction<{ user: User; token: string }>) => {
        state.loading = false;
        state.isLoggedIn = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
    })
    .addCase(apiLogin.rejected, handleRejected)
    .addCase(apiRefreshUser.pending, handlePending)
    .addCase(apiRefreshUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.isLoggedIn = true;
        state.user = action.payload;
    })
    .addCase(apiLogout.pending, handlePending)
    .addCase(apiLogout.fulfilled, () => {
        return INITIAL_STATE_AUTH;
    })
    .addCase(apiLogout.rejected, handleRejected)
    .addCase(apiRefreshUser.rejected, handleRejected);
},
});

export const authReducer = authSlice.reducer;