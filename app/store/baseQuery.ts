"use client"

import { fetchBaseQuery } from "@reduxjs/toolkit/query"
import { clearAuth } from "./slices/authSlice"
import toast from "react-hot-toast"

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",
  prepareHeaders: (headers, { getState, endpoint }) => {
    const noAuthRequiredEndpoints = ["login", "signUp", "forgot-password", "verify-otp", "reset-password", "change-password"]
    if (!noAuthRequiredEndpoints.some((e) => endpoint.includes(e))) {
      const token = (getState() as any)?.auth?.token
      if (token) {
        headers.set("Authorization", `Bearer ${token}`)
      }
    }
    return headers
  },
})

export const baseQueryWithAuth = async (
  args: any,
  api: any,
  extraOptions: Record<string, any>,
) => {
  const result = await baseQuery(args, api, extraOptions)

  const noAuthRequiredEndpoints = ["login", "signUp", "forgot-password", "verify-otp", "reset-password", "change-password"]

  if (
    result.error &&
    (result.error.status === 401 || result.error.status === 403) &&
    !noAuthRequiredEndpoints.some((e) => args.url?.includes(e))
  ) {
    toast.error("Session expired. Please log in again.")
    const state = api.getState() as any
    if (state.auth?.token) {
      api.dispatch(clearAuth())
    }
  }

  return result
}
