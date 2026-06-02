"use client"

import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface UiState {
  step: number
  globalLoading: boolean
  toast: { message: string; type: "success" | "error" | "info" } | null
}

const initialState: UiState = {
  step: 0,
  globalLoading: false,
  toast: null,
}

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setStep(state, action: PayloadAction<number>) {
      state.step = action.payload
    },
    setGlobalLoading(state, action: PayloadAction<boolean>) {
      state.globalLoading = action.payload
    },
    showToast(state, action: PayloadAction<UiState["toast"]>) {
      state.toast = action.payload
    },
    clearToast(state) {
      state.toast = null
    },
  },
})

export const { setStep, setGlobalLoading, showToast, clearToast } = uiSlice.actions
export default uiSlice.reducer
