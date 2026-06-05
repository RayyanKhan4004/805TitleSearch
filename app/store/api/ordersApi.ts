"use client"

import { createApi } from "@reduxjs/toolkit/query/react"
import { baseQueryWithAuth } from "../baseQuery"
import type { Order } from "@/app/components/feature/tables/types"

export const ordersApi = createApi({
  reducerPath: "ordersApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Orders"],
  endpoints: (builder) => ({
    fetchOrders: builder.query<Order[], void>({
      query: () => ({ url: "/orders", method: "GET" }),
      providesTags: ["Orders"],
    }),

    updateOrderRush: builder.mutation<Order, { no: string; rush: boolean }>({
      query: ({ no, rush }) => ({
        url: `/orders/${no}/rush`,
        method: "PATCH",
        body: { rush },
      }),
      invalidatesTags: ["Orders"],
    }),

    createOrder: builder.mutation<Order, Record<string, any>>({
      query: (body) => ({
        url: "/orders",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Orders"],
    }),
  }),
})

export const { useFetchOrdersQuery, useUpdateOrderRushMutation, useCreateOrderMutation } = ordersApi
