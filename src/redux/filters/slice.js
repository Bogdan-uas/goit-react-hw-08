import { createSlice } from "@reduxjs/toolkit";

const filtersSlice = createSlice({
name: "filters",
initialState: {
    filter: "",
    searchBy: "name",
},
reducers: {
    setFilter(state, action) {
        state.filter = action.payload;
    },
    setSearchBy(state, action) {
        state.searchBy = action.payload;
    },
},
});

export const { setFilter, setSearchBy } = filtersSlice.actions;
export const filtersReducer = filtersSlice.reducer;