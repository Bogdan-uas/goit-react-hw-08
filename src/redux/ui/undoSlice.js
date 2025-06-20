import { createSlice } from "@reduxjs/toolkit";

const undoSlice = createSlice({
name: 'undo',
initialState: null,
reducers: {
    storeUndo(state, action) {
        return action.payload;
    },
    clearUndo() {
        return null;
    }
}
});

export const { storeUndo, clearUndo } = undoSlice.actions;
export default undoSlice.reducer;