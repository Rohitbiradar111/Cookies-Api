import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: any = [];

const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    addNote: (state, action: PayloadAction<any>) => {
      state.push(action.payload);
    },
    deleteNote: (state, action: PayloadAction<number>) => {
      return state.filter((note: any) => note.id !== action.payload);
    },
    updateNote: (state, action: PayloadAction<any>) => {
      const { id, title, description } = action.payload;
      const noteIndex = state.findIndex((note: any) => note.id === id);
      if (noteIndex !== -1) {
        state[noteIndex] = { id, title, description };
      }
    },
  },
});

export const { addNote, deleteNote, updateNote } = notesSlice.actions;
export default notesSlice.reducer;
