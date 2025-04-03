import { configureStore } from "@reduxjs/toolkit";
import { phonebookReducer } from "./contactsSlice.js";
import { filtersReducer } from "./filtersSlice.js";

export const store = configureStore({
    reducer: {
        phonebook: phonebookReducer,
        filters: filtersReducer,
    },
});