import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { selectFilter, selectSearchBy, selectSortOrder } from "../filters/selectors";
import type { Contact } from "./types";

export const selectContacts = (state: RootState): Contact[] => state.phonebook.items;
export const selectIsLoading = (state: RootState): boolean => state.phonebook.loading;
export const selectError = (state: RootState): string | null => state.phonebook.error;

export const selectFilteredContacts = createSelector(
    [selectContacts, selectFilter, selectSearchBy, selectSortOrder],
    (contacts, filter, searchBy, sortOrder): Contact[] => {
    const lowerCaseFilter = filter.toLowerCase();

    const filteredContacts = contacts.filter((contact) => {
        const field = contact[searchBy as keyof Pick<Contact, "name" | "number">];
        return typeof field === "string" && field.toLowerCase().includes(lowerCaseFilter);
    });

    const sorted = [...filteredContacts];
    if (sortOrder === "asc") {
        sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOrder === "desc") {
        sorted.sort((a, b) => b.name.localeCompare(a.name));
    }

    return sorted;
}
);