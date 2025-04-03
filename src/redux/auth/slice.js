import { createSlice } from "@reduxjs/toolkit";
import {
    apiRegister,
    apiLogin,
    apiRefreshUser,
    apiLogout,
} from "../auth/operations.js";

export const INITIAL_STATE_AUTH = {
user: {
    name: null,
    email: null,
},
token: null,
isLoggedIn: false,
isRefreshing: false,
};

const handlePending = (state) => {
    state.loading = true;
    state.error = null;
};

const handleRejected = (state) => {
    state.loading = false;
    state.error = true;
};

const authSlice = createSlice({
name: "auth",
initialState: INITIAL_STATE_AUTH,
reducers: {
    // Defining additional if it is needed
},

extraReducers: (builder) => {
    builder
    .addCase(apiRegister.pending, handlePending)
    .addCase(apiRegister.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoggedIn = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
    })
    .addCase(apiRegister.rejected, handleRejected)
    .addCase(apiLogin.pending, handlePending)
    .addCase(apiLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoggedIn = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
    })
    .addCase(apiLogin.rejected, handleRejected)
    .addCase(apiRefreshUser.pending, handlePending)
    .addCase(apiRefreshUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoggedIn = true;
        state.user = action.payload;
    })
    .addCase(apiLogout.rejected, handleRejected)
    .addCase(apiLogout.pending, handlePending)
    .addCase(apiLogout.fulfilled, () => {
        return INITIAL_STATE_AUTH;
    })
    .addCase(apiRefreshUser.rejected, handleRejected);
},
});

export const authReducer = authSlice.reducer;