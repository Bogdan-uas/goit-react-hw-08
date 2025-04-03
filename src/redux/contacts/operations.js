import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "../../service/api.js";

export const fetchContacts = createAsyncThunk(
"contacts/fetchAll",
async (_, thunkAPI) => {
    try {
        const { data } = await instance.get("/contacts");
        console.log("data:", data);
        return data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
}
);

export const addContact = createAsyncThunk(
"contacts/addContact",
async (contact, thunkAPI) => {
    try {
        const response = await instance.post("/contacts", { ...contact });
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
}
);

export const deleteContact = createAsyncThunk(
"contacts/deleteContact",
async (contactId, thunkAPI) => {
    try {
        const response = await instance.delete(`/contacts/${contactId}`);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
}
);