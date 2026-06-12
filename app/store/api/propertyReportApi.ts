"use client"

import { createApi } from "@reduxjs/toolkit/query/react"
import { baseQueryWithAuth } from "../baseQuery"

interface GetReportBody {
  searchType: string
  apn?: string
  zipCode?: string
  houseNumber?: string
  streetName?: string
  city?: string
  state?: string
  zip?: string
  ownerName?: string
}

export interface ReportResponse {
  found: boolean
  source: string
  propertyId: number
  raw: Record<string, any>
  form: Record<string, any>
  transactions?: Record<string, any>[]
}

export const propertyReportApi = createApi({
  reducerPath: "propertyReportApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Report"],
  endpoints: (builder) => ({
    getReport: builder.query<ReportResponse, GetReportBody>({
      query: (body) => ({
        url: "/get-report",
        method: "POST",
        body,
      }),
    }),

    searchReport: builder.mutation<ReportResponse, GetReportBody>({
      query: (body) => ({
        url: "/get-report",
        method: "POST",
        body,
      }),
    }),
  }),
})

export const { useGetReportQuery, useSearchReportMutation } = propertyReportApi
