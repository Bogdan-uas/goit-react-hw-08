import { createSlice } from "@reduxjs/toolkit";
import { apiLogout } from "../auth/operations";
import { fetchContacts, addContact, deleteContact, updateContact, deleteAllContacts } from "./operations.js";

export const INITIAL_STATE_CONTACTS = {
    items: [],
    loading: false,
    error: null,
};

const contactsSlice = createSlice({
name: "contacts",
initialState: INITIAL_STATE_CONTACTS,
extraReducers: (builder) => {
    builder
    .addCase(fetchContacts.pending, (state) => {
        state.loading = true;
        state.error = null;
    })
    .addCase(fetchContacts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
    })
    .addCase(fetchContacts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
    })
    .addCase(addContact.pending, (state) => {
        state.loading = true;
        state.error = null;
    })
    .addCase(addContact.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
    })
    .addCase(addContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
    })
    .addCase(deleteContact.pending, (state) => {
        state.loading = true;
        state.error = null;
    })
    .addCase(deleteContact.fulfilled, (state, action) => {
        state.items = state.items.filter(
            (contact) => contact.id !== action.payload.id
        );
        state.loading = false;
    })
    .addCase(deleteContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
    })
    .addCase(updateContact.fulfilled, (state, action) => {
        const index = state.items.findIndex(
            (contact) => contact.id === action.payload.id
        );
        if (index !== -1) {
            state.items[index] = action.payload;
        }
    })
    .addCase(apiLogout.fulfilled, (state) => {
        state.items = [];
        state.loading = false;
        state.error = null;
    })
    .addCase(deleteAllContacts.fulfilled, (state, action) => {
        const deletedIds = action.payload.map(contact => contact.id);
        state.items = state.items.filter(contact => !deletedIds.includes(contact.id));
    });
},
});

export const contactsReducer = contactsSlice.reducer;