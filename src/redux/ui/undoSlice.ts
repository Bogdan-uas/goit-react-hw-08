import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type UndoState = any | null; 

const initialState: UndoState = null;

const undoSlice = createSlice({
name: "undo",
initialState,
reducers: {
    storeUndo(state, action: PayloadAction<UndoState>) {
        return action.payload;
    },
    clearUndo() {
        return null;
    },
},
});

export const { storeUndo, clearUndo } = undoSlice.actions;
export default undoSlice.reducer;