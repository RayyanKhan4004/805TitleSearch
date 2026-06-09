"use client"

import { createApi } from "@reduxjs/toolkit/query/react"
import { baseQueryWithAuth } from "../baseQuery"
import type { Order, OrderDetail, PaginatedOrdersResponse, CodeBookEntry } from "@/app/components/feature/tables/types"

export const ordersApi = createApi({
  reducerPath: "ordersApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Orders", "CodeBook"],
  endpoints: (builder) => ({
    fetchOrders: builder.query<
      PaginatedOrdersResponse,
      { page?: number; pageSize?: number }
    >({
      query: ({ page = 1, pageSize = 50 } = {}) => ({
        url: "/orders",
        method: "GET",
        params: { page, pageSize },
      }),
      providesTags: ["Orders"],
      transformResponse: (response: Order[] | PaginatedOrdersResponse) => {
        if (Array.isArray(response)) {
          return {
            data: response,
            total: response.length,
            page: 1,
            pageSize: response.length,
            totalPages: 1,
          };
        }
        return response;
      },
    }),

    updateOrderRush: builder.mutation<Order, { no: string; rush: boolean }>({
      query: ({ no, rush }) => ({
        url: `/orders/${no}/rush`,
        method: "PATCH",
        body: { rush },
      }),
      invalidatesTags: ["Orders"],
    }),

    fetchOrder: builder.query<OrderDetail, string>({
      query: (id) => ({
        url: `/orders/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Orders", id }],
    }),
    fetchCodeBook: builder.query<CodeBookEntry[], void>({
      query: () => ({
        url: `/codebook`,
        method: "GET",
      }),
      providesTags: ["CodeBook"],
    }),

    fetchCodeBookByCode: builder.query<CodeBookEntry, string>({
      query: (code) => ({
        url: `/codebook/${code}`,
        method: "GET",
      }),
      providesTags: (result, error, code) => [{ type: "CodeBook", id: code }],
    }),

    updateOrder: builder.mutation<
      OrderDetail,
      { id: string; body: Partial<OrderDetail> }
    >({
      query: ({ id, body }) => ({
        url: `/orders/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        "Orders",
        { type: "Orders", id },
      ],
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
});

export const { useFetchOrdersQuery, useFetchOrderQuery, useFetchCodeBookQuery, useFetchCodeBookByCodeQuery, useUpdateOrderRushMutation, useUpdateOrderMutation, useCreateOrderMutation } = ordersApi
