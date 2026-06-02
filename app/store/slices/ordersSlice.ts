"use client"

import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { Order, OrderLock } from "@/app/components/feature/tables/types"

interface OrdersState {
  list: Order[]
  selectedOrder: Order | null
  statuses: Record<string, string>
  lockedBy: Record<string, OrderLock>
  lockAttempt: number
  recentFiles: { no: string; addr: string; owner: string; status: string }[]
}

const initialState: OrdersState = {
  list: [],
  selectedOrder: null,
  statuses: {},
  lockedBy: {},
  lockAttempt: 0,
  recentFiles: [],
}

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setOrders(state, action: PayloadAction<Order[]>) {
      state.list = action.payload
    },
    selectOrder(state, action: PayloadAction<Order | null>) {
      state.selectedOrder = action.payload
    },
    setOrderStatus(state, action: PayloadAction<{ no: string; status: string }>) {
      state.statuses[action.payload.no] = action.payload.status
    },
    setLock(state, action: PayloadAction<{ no: string; lock: OrderLock | null }>) {
      const { no, lock } = action.payload
      if (lock) state.lockedBy[no] = lock
      else delete state.lockedBy[no]
    },
    incrementLockAttempt(state) {
      state.lockAttempt += 1
    },
    setRecentFiles(state, action: PayloadAction<OrdersState["recentFiles"]>) {
      state.recentFiles = action.payload
    },
  },
})

export const { setOrders, selectOrder, setOrderStatus, setLock, incrementLockAttempt, setRecentFiles } =
  ordersSlice.actions
export default ordersSlice.reducer
