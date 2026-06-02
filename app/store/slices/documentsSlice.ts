"use client"

import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { DocItem, NoteItem, Document } from "@/app/components/feature/tables/types"

interface DocumentsState {
  docs: DocItem[]
  notes: NoteItem[]
  generatedDocs: Document[]
}

const initialState: DocumentsState = {
  docs: [],
  notes: [],
  generatedDocs: [],
}

const documentsSlice = createSlice({
  name: "documents",
  initialState,
  reducers: {
    setDocs(state, action: PayloadAction<DocItem[]>) {
      state.docs = action.payload
    },
    addDoc(state, action: PayloadAction<DocItem>) {
      state.docs.push(action.payload)
    },
    removeDoc(state, action: PayloadAction<number>) {
      state.docs = state.docs.filter((_, i) => i !== action.payload)
    },
    setNotes(state, action: PayloadAction<NoteItem[]>) {
      state.notes = action.payload
    },
    addNote(state, action: PayloadAction<NoteItem>) {
      state.notes.push(action.payload)
    },
    setGeneratedDocs(state, action: PayloadAction<Document[]>) {
      state.generatedDocs = action.payload
    },
    addGeneratedDoc(state, action: PayloadAction<Document>) {
      state.generatedDocs.push(action.payload)
    },
  },
})

export const { setDocs, addDoc, removeDoc, setNotes, addNote, setGeneratedDocs, addGeneratedDoc } =
  documentsSlice.actions
export default documentsSlice.reducer
