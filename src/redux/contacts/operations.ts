import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "../service/api";
import type { Contact, ContactUpdate } from "./types";

export const fetchContacts = createAsyncThunk<Contact[]>(
    "contacts/fetchAll",
    async (_, thunkAPI) => {
        try {
            const { data } = await instance.get<Contact[]>("/contacts");
            console.log("data:", data);
            return data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const addContact = createAsyncThunk<Contact, Omit<Contact, "id">>(
    "contacts/addContact",
    async (contact, thunkAPI) => {
        try {
            const response = await instance.post<Contact>("/contacts", contact);
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const deleteContact = createAsyncThunk<Contact, string>(
    "contacts/deleteContact",
    async (contactId, thunkAPI) => {
        try {
            const response = await instance.delete<Contact>(`/contacts/${contactId}`);
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const updateContact = createAsyncThunk<
    Contact,
    { contactId: string; updates: ContactUpdate }
>(
    "contacts/updateContact",
    async ({ contactId, updates }, thunkAPI) => {
        try {
            const response = await instance.patch<Contact>(`/contacts/${contactId}`, updates);
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

export const deleteAllContacts = createAsyncThunk<Contact[]>(
    "contacts/deleteAllContacts",
    async (_, thunkAPI) => {
        try {
            const { data: contacts } = await instance.get<Contact[]>("/contacts");
            const deletedContacts: Contact[] = [];

            for (const contact of contacts) {
                const { data: deleted } = await instance.delete<Contact>(`/contacts/${contact.id}`);
                deletedContacts.push(deleted);
            }

            return deletedContacts;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);