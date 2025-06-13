import { createSlice } from "@reduxjs/toolkit";

const filtersSlice = createSlice({
name: "filters",
initialState: {
    filter: "",
    searchBy: "name",
    sortOrder: 'asc',
},
reducers: {
    setFilter: (state, action) => {
        state.filter = action.payload;
    },
    setSearchBy: (state, action) => {
        state.searchBy = action.payload;
    },
    setSortOrder: (state, action) => {
        state.sortOrder = action.payload;
    },
},
});

export const { setFilter, setSearchBy, setSortOrder } = filtersSlice.actions;
export const filtersReducer = filtersSlice.reducer;