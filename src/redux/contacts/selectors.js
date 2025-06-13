import { createSelector } from "@reduxjs/toolkit";
import { selectFilter, selectSearchBy, selectSortOrder } from "../filters/selectors";

export const selectContacts = (state) => state.phonebook.items;
export const selectIsLoading = (state) => state.phonebook.loading;
export const selectError = (state) => state.phonebook.error;

export const selectFilteredContacts = createSelector(
[selectContacts, selectFilter, selectSearchBy, selectSortOrder],
(contacts, filter, searchBy, sortOrder) => {
    const lowerCaseFilter = filter.toLowerCase();

    let filteredContacts = contacts.filter((contact) => {
        return contact[searchBy].toLowerCase().includes(lowerCaseFilter);
    });

    if (sortOrder === "asc") {
    filteredContacts = [...filteredContacts].sort((a, b) =>
        a.name.localeCompare(b.name)
    );
    } else if (sortOrder === "desc") {
    filteredContacts = [...filteredContacts].sort((a, b) =>
        b.name.localeCompare(a.name)
    );
    }

    return filteredContacts;
}
);