"use client"

import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface AuthUser {
  id: number
  email: string
  firstName: string
  lastName: string
  isActive: boolean
}

interface AuthState {
  isAuthenticated: boolean
  token: string | null
  user: AuthUser | null
}

const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  user: null,
}

interface LoginPayload {
  token: string
  user: AuthUser
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action: PayloadAction<LoginPayload>) {
      state.isAuthenticated = true
      state.token = action.payload.token
      state.user = action.payload.user
    },
    logout(state) {
      state.isAuthenticated = false
      state.token = null
      state.user = null
    },
    clearAuth(state) {
      state.isAuthenticated = false
      state.token = null
      state.user = null
    },
  },
})

export const { login, logout, clearAuth } = authSlice.actions
export default authSlice.reducer
