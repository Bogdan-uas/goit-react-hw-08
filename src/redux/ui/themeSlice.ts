import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ThemeState {
    darkMode: boolean;
}

const initialState: ThemeState = {
    darkMode: localStorage.getItem("darkMode") === "true" || false,
};

const themeSlice = createSlice({
name: "theme",
initialState,
reducers: {
    toggleDarkMode(state) {
        state.darkMode = !state.darkMode;
        localStorage.setItem("darkMode", String(state.darkMode));
    },
    setDarkMode(state, action: PayloadAction<boolean>) {
        state.darkMode = action.payload;
        localStorage.setItem("darkMode", String(action.payload));
    },
},
});

export const { toggleDarkMode, setDarkMode } = themeSlice.actions;
export default themeSlice.reducer;