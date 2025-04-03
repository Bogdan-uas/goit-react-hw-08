import { createSelector } from "@reduxjs/toolkit";
import { selectFilter } from "../filters/selectors";

export const selectContacts = (state) => state.phonebook.items;
export const selectIsLoading = (state) => state.phonebook.loading;
export const selectError = (state) => state.phonebook.error;

export const selectFilteredContacts = createSelector(
[selectContacts, selectFilter],
(contacts, filter) => {
    const lowerCaseFilter = filter.toLowerCase();
    return contacts.filter(
    (contact) =>
        contact.name.toLowerCase().includes(lowerCaseFilter) ||
        contact.number.includes(filter)
    );
}
);