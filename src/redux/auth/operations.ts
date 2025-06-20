import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "../service/api";
import { RootState } from "../store";

interface AuthResponse {
token: string;
user: {
    name: string;
    email: string;
};
}

interface Credentials {
    name?: string;
    email: string;
    password: string;
}

export const setToken = (token: string) => {
    instance.defaults.headers.common.Authorization = `Bearer ${token}`;
};

export const clearToken = () => {
    instance.defaults.headers.common.Authorization = "";
};

export const apiRegister = createAsyncThunk<AuthResponse, Credentials, { rejectValue: string }>(
"auth/register",
async (formData, thunkAPI) => {
    try {
        const { data } = await instance.post<AuthResponse>("/users/signup", formData);
        setToken(data.token);
        return data;
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.message);
    }
}
);

export const apiLogin = createAsyncThunk<AuthResponse, Credentials, { rejectValue: string }>(
"auth/login",
async (formData, thunkAPI) => {
    try {
        const { data } = await instance.post<AuthResponse>("/users/login", formData);
        console.log("Login data:", data);
        setToken(data.token);
        return data;
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.message);
    }
}
);

interface RefreshResponse {
    name: string;
    email: string;
}

export const apiRefreshUser = createAsyncThunk<RefreshResponse, void, { state: RootState; rejectValue: string }>(
"auth/refresh",
async (_, thunkAPI) => {
    try {
        const state = thunkAPI.getState();
        const token = state.auth.token;
    if (!token) {
        return thunkAPI.rejectWithValue("No token found");
    }
        setToken(token);
        const { data } = await instance.get<RefreshResponse>("/users/current");
        console.log("Refresh data:", data);
        return data;
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.message);
    }
}
);

export const apiLogout = createAsyncThunk<void, void, { rejectValue: string }>(
"auth/logout",
async (_, thunkAPI) => {
    try {
        await instance.post("/users/logout");
        clearToken();
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.message);
    }
}
);