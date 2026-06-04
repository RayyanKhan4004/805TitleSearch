"use client"

import { createApi } from "@reduxjs/toolkit/query/react"
import { baseQueryWithAuth } from "../baseQuery"

interface LoginRequest {
  email: string
  password: string
}

interface LoginResponse {
  message: string
  user: {
    id: number
    email: string
    firstName: string
    lastName: string
    isActive: boolean
    createdAt: string
    updatedAt: string
  }
  access_token: string
}

interface ProfileResponse {
  id: number
  email: string
  firstName: string
  lastName: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithAuth,
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
    }),
    getProfile: builder.query<ProfileResponse, void>({
      query: () => ({ url: "/auth/profile", method: "GET" }),
    }),
  }),
})

export const { useLoginMutation, useGetProfileQuery } = authApi
