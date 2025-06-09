import { createSelector } from "@reduxjs/toolkit";
import { selectFilter, selectSearchBy } from "../filters/selectors";

export const selectContacts = (state) => state.phonebook.items;
export const selectIsLoading = (state) => state.phonebook.loading;
export const selectError = (state) => state.phonebook.error;

export const selectFilteredContacts = createSelector(
[selectContacts, selectFilter, selectSearchBy],
(contacts, filter, searchBy) => {
    const lowerCaseFilter = filter.toLowerCase();

    return contacts.filter((contact) => {
    if (searchBy === "name") {
        return contact.name.toLowerCase().includes(lowerCaseFilter);
    } else {
        return contact.number.toLowerCase().includes(lowerCaseFilter);
    }
    });
}
);