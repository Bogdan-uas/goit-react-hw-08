import { RootState } from "../store";

export const selectFilter = (state: RootState): string => state.filters.filter;

export const selectSearchBy = (state: RootState): string => state.filters.searchBy;

export const selectSortOrder = (state: RootState): "asc" | "desc" | "default" => state.filters.sortOrder;