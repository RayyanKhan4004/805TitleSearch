"use client"

import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { ChainCode, SharedState } from "@/app/components/feature/tables/types"

const initialState: SharedState = {
  vesting: "",
  legal: "",
  leaseHold: "",
  effectiveDate: "",
  chainCodes: [],
}

const sharedSlice = createSlice({
  name: "shared",
  initialState,
  reducers: {
    setVesting(state, action: PayloadAction<string>) {
      state.vesting = action.payload
    },
    setLegal(state, action: PayloadAction<string>) {
      state.legal = action.payload
    },
    setLeaseHold(state, action: PayloadAction<string>) {
      state.leaseHold = action.payload
    },
    setEffectiveDate(state, action: PayloadAction<string>) {
      state.effectiveDate = action.payload
    },
    addChainCode(state, action: PayloadAction<ChainCode>) {
      state.chainCodes.push(action.payload)
    },
    removeChainCode(state, action: PayloadAction<number>) {
      state.chainCodes = state.chainCodes.filter((c) => c.id !== action.payload)
    },
    updateChainCode(state, action: PayloadAction<{ id: number; code: Partial<ChainCode> }>) {
      const idx = state.chainCodes.findIndex((c) => c.id === action.payload.id)
      if (idx !== -1) Object.assign(state.chainCodes[idx], action.payload.code)
    },
    setChainCodes(state, action: PayloadAction<ChainCode[]>) {
      state.chainCodes = action.payload
    },
    replaceShared(state, action: PayloadAction<SharedState>) {
      return action.payload
    },
  },
})

export const {
  setVesting,
  setLegal,
  setLeaseHold,
  setEffectiveDate,
  addChainCode,
  removeChainCode,
  updateChainCode,
  setChainCodes,
  replaceShared,
} = sharedSlice.actions
export default sharedSlice.reducer
