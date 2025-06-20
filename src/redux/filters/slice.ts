import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FiltersState {
    filter: string;
    searchBy: "name" | "number";
    sortOrder: "default" | "asc" | "desc";
}

const initialState: FiltersState = {
    filter: "",
    searchBy: "name",
    sortOrder: "default",
};

const filtersSlice = createSlice({
name: "filters",
initialState,
reducers: {
    setFilter: (state, action: PayloadAction<string>) => {
        state.filter = action.payload;
    },
    setSearchBy: (state, action: PayloadAction<"name" | "number">) => {
        state.searchBy = action.payload;
    },
    setSortOrder: (state, action: PayloadAction<"default" | "asc" | "desc">) => {
        state.sortOrder = action.payload;
    },
},
});

export const { setFilter, setSearchBy, setSortOrder } = filtersSlice.actions;
export const filtersReducer = filtersSlice.reducer;