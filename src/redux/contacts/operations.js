import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "../service/api";

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

export const updateContact = createAsyncThunk(
"contacts/updateContact",
async ({ contactId, updates }, thunkAPI) => {
    try {
        const response = await instance.patch(`/contacts/${contactId}`, updates);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
}
);
export const deleteAllContacts = createAsyncThunk(
    "contacts/deleteAllContacts",
    async (_, thunkAPI) => {
    try {
        const { data: contacts } = await instance.get("/contacts");
        const deletedContacts = [];

        for (const contact of contacts) {
            const { data: deleted } = await instance.delete(`/contacts/${contact.id}`);
            deletedContacts.push(deleted);
        }

        return deletedContacts;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
    }
);