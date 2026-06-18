"use client"

import { createApi } from "@reduxjs/toolkit/query/react"
import { baseQueryWithAuth } from "../baseQuery"
import type { Order, OrderDetail, PaginatedOrdersResponse, CodeBookEntry, OrderNote } from "@/app/components/feature/tables/types"

export const ordersApi = createApi({
  reducerPath: "ordersApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Orders", "CodeBook", "Notes"],
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

    deleteCodeBook: builder.mutation<null, string>({
      query: (id) => ({
        url: `/codebook/${id}`,
        method: "DELETE",
        responseHandler: async (response: Response) =>
          response.status === 204 || response.headers.get("content-length") === "0"
            ? null
            : response.json(),
      }),
      transformResponse: () => null,
      invalidatesTags: ["CodeBook"],
    }),

    createCodeBook: builder.mutation<CodeBookEntry, { code: string; verbiage: string }>({
      query: (body) => ({
        url: "/codebook",
        method: "POST",
        body,
      }),
      invalidatesTags: ["CodeBook"],
    }),

    updateCodeBook: builder.mutation<CodeBookEntry, { code: string; verbiage?: string }>({
      query: ({ code, ...body }) => ({
        url: `/codebook/${encodeURIComponent(code)}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["CodeBook"],
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

    uploadFile: builder.mutation<string, FormData>({
      query: (body) => ({
        url: "/orders/upload",
        method: "POST",
        body,
        responseHandler: "text" as const,
      }),
    }),

    updateOrderChainFile: builder.mutation<
      OrderDetail,
      { id: string; titleChainReviews: Record<string, unknown>[] }
    >({
      query: ({ id, titleChainReviews }) => ({
        url: `/orders/${id}`,
        method: "PATCH",
        body: { titleChainReviews },
      }),
      invalidatesTags: (result, error, { id }) => [
        "Orders",
        { type: "Orders", id },
      ],
    }),

    deleteOrder: builder.mutation<void, string>({
      query: (id) => ({
        url: `/orders/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Orders"],
    }),

    searchCodeBook: builder.query<CodeBookEntry[], string>({
      query: (search) => ({
        url: "/codebook",
        params: search ? { search } : undefined,
      }),
      providesTags: ["CodeBook"],
    }),

    createTsriException: builder.mutation<
      { id: number; code: string; verbiage: string; type: string },
      { orderId: string; code?: string; verbiage?: string; type?: string; sortOrder?: number }
    >({
      query: ({ orderId, ...body }) => ({
        url: `/orders/${orderId}/tsri-exceptions`,
        method: "POST",
        body,
      }),
    }),

    deleteTsriException: builder.mutation<{ message: string }, { orderId: string; id: number }>({
      query: ({ orderId, id }) => ({
        url: `/orders/${orderId}/tsri-exceptions/${id}`,
        method: "DELETE",
      }),
    }),

    patchTsriException: builder.mutation<
      { id: number; code: string; verbiage: string } | null,
      { orderId: string; id: number; verbiage: string }
    >({
      query: ({ orderId, id, verbiage }) => ({
        url: `/orders/${orderId}/tsri-exceptions/${id}`,
        method: "PATCH",
        body: { verbiage },
        responseHandler: async (response: Response) => {
          if (response.status === 204) return null;
          const text = await response.text();
          if (!text) return null;
          try { return JSON.parse(text); } catch { return null; }
        },
      }),
    }),

    createTsriRequirement: builder.mutation<
      { id: number; code: string; verbiage: string; type: string },
      { orderId: string; code?: string; verbiage?: string; type?: string; sortOrder?: number }
    >({
      query: ({ orderId, ...body }) => ({
        url: `/orders/${orderId}/tsri-requirements`,
        method: "POST",
        body,
      }),
    }),

    deleteTsriRequirement: builder.mutation<{ message: string }, { orderId: string; id: number }>({
      query: ({ orderId, id }) => ({
        url: `/orders/${orderId}/tsri-requirements/${id}`,
        method: "DELETE",
      }),
    }),

    patchTsriRequirement: builder.mutation<
      { id: number; code: string; verbiage: string } | null,
      { orderId: string; id: number; verbiage: string }
    >({
      query: ({ orderId, id, verbiage }) => ({
        url: `/orders/${orderId}/tsri-requirements/${id}`,
        method: "PATCH",
        body: { verbiage },
        responseHandler: async (response: Response) => {
          if (response.status === 204) return null;
          const text = await response.text();
          if (!text) return null;
          try { return JSON.parse(text); } catch { return null; }
        },
      }),
    }),

    createTractMap: builder.mutation<any, { orderId: string; data: FormData }>({
      query: ({ orderId, data }) => ({
        url: `/orders/${orderId}/tract-map`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { orderId }) => [{ type: "Orders", id: orderId }],
    }),

    createAssessorMap: builder.mutation<any, { orderId: string; data: FormData }>({
      query: ({ orderId, data }) => ({
        url: `/orders/${orderId}/assessor-map`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { orderId }) => [{ type: "Orders", id: orderId }],
    }),

    createRunsheet: builder.mutation<any, { orderId: string; data: FormData }>({
      query: ({ orderId, data }) => ({
        url: `/orders/${orderId}/runsheet`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { orderId }) => [{ type: "Orders", id: orderId }],
    }),

    createStarter: builder.mutation<any, { orderId: string; data: FormData }>({
      query: ({ orderId, data }) => ({
        url: `/orders/${orderId}/starters`,
        method: "POST",
        body: data,
        responseHandler: async (response: Response) => {
          if (response.status === 204) return null;
          const text = await response.text();
          if (!text) return null;
          try { return JSON.parse(text); } catch { return text; }
        },
      }),
      invalidatesTags: (result, error, { orderId }) => [{ type: "Orders", id: orderId }],
    }),

    deleteStarter: builder.mutation<null, { orderId: string; id: number }>({
      query: ({ orderId, id }) => ({
        url: `/orders/${orderId}/starters/${id}`,
        method: "DELETE",
        responseHandler: async (response: Response) =>
          response.status === 204 || response.headers.get("content-length") === "0"
            ? null : response.json(),
      }),
      transformResponse: () => null,
      invalidatesTags: (result, error, { orderId }) => [{ type: "Orders", id: orderId }],
    }),

    createTitleChainDoc: builder.mutation<any, { orderId: string; data: FormData }>({
      query: ({ orderId, data }) => ({
        url: `/orders/${orderId}/title-chain-reviews`,
        method: "POST",
        body: data,
        responseHandler: async (response: Response) => {
          if (response.status === 204) return null;
          const text = await response.text();
          if (!text) return null;
          try { return JSON.parse(text); } catch { return text; }
        },
      }),
      invalidatesTags: (result, error, { orderId }) => [{ type: "Orders", id: orderId }],
    }),

    deleteTitleChainReview: builder.mutation<null, { orderId: string; id: number }>({
      query: ({ orderId, id }) => ({
        url: `/orders/${orderId}/title-chain-reviews/${id}`,
        method: "DELETE",
        responseHandler: async (response: Response) =>
          response.status === 204 || response.headers.get("content-length") === "0"
            ? null : response.json(),
      }),
      transformResponse: () => null,
      invalidatesTags: (result, error, { orderId }) => [{ type: "Orders", id: orderId }],
    }),

    deleteTractMap: builder.mutation<null, { orderId: string; id: number }>({
      query: ({ orderId, id }) => ({
        url: `/orders/${orderId}/tract-map/${id}`,
        method: "DELETE",
        responseHandler: async (response: Response) =>
          response.status === 204 || response.headers.get("content-length") === "0"
            ? null : response.json(),
      }),
      transformResponse: () => null,
      invalidatesTags: (result, error, { orderId }) => [{ type: "Orders", id: orderId }],
    }),

    deleteAssessorMap: builder.mutation<null, { orderId: string; id: number }>({
      query: ({ orderId, id }) => ({
        url: `/orders/${orderId}/assessor-map/${id}`,
        method: "DELETE",
        responseHandler: async (response: Response) =>
          response.status === 204 || response.headers.get("content-length") === "0"
            ? null : response.json(),
      }),
      transformResponse: () => null,
      invalidatesTags: (result, error, { orderId }) => [{ type: "Orders", id: orderId }],
    }),

    deleteRunsheet: builder.mutation<null, { orderId: string; id: number }>({
      query: ({ orderId, id }) => ({
        url: `/orders/${orderId}/runsheet/${id}`,
        method: "DELETE",
        responseHandler: async (response: Response) =>
          response.status === 204 || response.headers.get("content-length") === "0"
            ? null : response.json(),
      }),
      transformResponse: () => null,
      invalidatesTags: (result, error, { orderId }) => [{ type: "Orders", id: orderId }],
    }),

    patchAssessorMap: builder.mutation<any, { orderId: string; id: number; data: FormData }>({
      query: ({ orderId, id, data }) => ({
        url: `/orders/${orderId}/assessor-map/${id}`,
        method: "PATCH",
        body: data,
        responseHandler: async (response: Response) => {
          if (response.status === 204) return null;
          const text = await response.text();
          if (!text) return null;
          try { return JSON.parse(text); } catch { return null; }
        },
      }),
      invalidatesTags: (result, error, { orderId }) => [{ type: "Orders", id: orderId }],
    }),

    patchTractMap: builder.mutation<any, { orderId: string; id: number; data: FormData }>({
      query: ({ orderId, id, data }) => ({
        url: `/orders/${orderId}/tract-map/${id}`,
        method: "PATCH",
        body: data,
        responseHandler: async (response: Response) => {
          if (response.status === 204) return null;
          const text = await response.text();
          if (!text) return null;
          try { return JSON.parse(text); } catch { return null; }
        },
      }),
      invalidatesTags: (result, error, { orderId }) => [{ type: "Orders", id: orderId }],
    }),

    patchRunsheet: builder.mutation<any, { orderId: string; id: number; data: FormData }>({
      query: ({ orderId, id, data }) => ({
        url: `/orders/${orderId}/runsheet/${id}`,
        method: "PATCH",
        body: data,
        responseHandler: async (response: Response) => {
          if (response.status === 204) return null;
          const text = await response.text();
          if (!text) return null;
          try { return JSON.parse(text); } catch { return null; }
        },
      }),
      invalidatesTags: (result, error, { orderId }) => [{ type: "Orders", id: orderId }],
    }),

    patchStarter: builder.mutation<any, { orderId: string; id: number; data: FormData }>({
      query: ({ orderId, id, data }) => ({
        url: `/orders/${orderId}/starters/${id}`,
        method: "PATCH",
        body: data,
        responseHandler: async (response: Response) => {
          if (response.status === 204) return null;
          const text = await response.text();
          if (!text) return null;
          try { return JSON.parse(text); } catch { return null; }
        },
      }),
      invalidatesTags: (result, error, { orderId }) => [{ type: "Orders", id: orderId }],
    }),

    patchTitleChainReview: builder.mutation<any, { orderId: string; id: number; data: FormData }>({
      query: ({ orderId, id, data }) => ({
        url: `/orders/${orderId}/title-chain-reviews/${id}`,
        method: "PATCH",
        body: data,
        responseHandler: async (response: Response) => {
          if (response.status === 204) return null;
          const text = await response.text();
          if (!text) return null;
          try { return JSON.parse(text); } catch { return null; }
        },
      }),
      invalidatesTags: (result, error, { orderId }) => [{ type: "Orders", id: orderId }],
    }),

    createTaxCert: builder.mutation<
      { id: number; code: string; verbiage: string },
      { orderId: number | string; code: string; verbiage?: string }
    >({
      query: ({ orderId, ...body }) => ({
        url: `/orders/${orderId}/tax-certs`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { orderId }) => [{ type: "Orders", id: orderId }],
    }),

    deleteTaxCert: builder.mutation<{ message: string }, { orderId: number | string; id: number }>({
      query: ({ orderId, id }) => ({
        url: `/orders/${orderId}/tax-certs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { orderId }) => [{ type: "Orders", id: orderId }],
    }),

    patchTaxCert: builder.mutation<
      { id: number; code: string; verbiage: string } | null,
      { orderId: number | string; id: number; verbiage: string }
    >({
      query: ({ orderId, id, verbiage }) => ({
        url: `/orders/${orderId}/tax-certs/${id}`,
        method: "PATCH",
        body: { verbiage },
        responseHandler: async (response: Response) => {
          if (response.status === 204) return null;
          const text = await response.text();
          if (!text) return null;
          try { return JSON.parse(text); } catch { return null; }
        },
      }),
    }),

    reorderTsriExceptions: builder.mutation<
      void,
      { orderId: string; items: { id: number; sortOrder: number }[] }
    >({
      query: ({ orderId, items }) => ({
        url: `/orders/${orderId}/tsri-exceptions/sort-order`,
        method: "PATCH",
        body: { items },
      }),
    }),

    reorderTsriRequirements: builder.mutation<
      void,
      { orderId: string; items: { id: number; sortOrder: number }[] }
    >({
      query: ({ orderId, items }) => ({
        url: `/orders/${orderId}/tsri-requirements/sort-order`,
        method: "PATCH",
        body: { items },
      }),
    }),

    reorderTaxCerts: builder.mutation<
      void,
      { orderId: number | string; items: { id: number; sortOrder: number }[] }
    >({
      query: ({ orderId, items }) => ({
        url: `/orders/${orderId}/tax-certs/sort-order`,
        method: "PATCH",
        body: { items },
      }),
    }),

    fetchNotes: builder.query<OrderNote[], string>({
      query: (orderId) => ({ url: `/orders/${orderId}/notes`, method: "GET" }),
      providesTags: (result, error, orderId) => [{ type: "Notes", id: orderId }],
    }),

    createNote: builder.mutation<OrderNote, { orderId: string; content: string; title?: string }>({
      query: ({ orderId, ...body }) => ({
        url: `/orders/${orderId}/notes`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { orderId }) => [{ type: "Notes", id: orderId }],
    }),

    updateNote: builder.mutation<OrderNote, { orderId: string; id: number; content?: string; title?: string }>({
      query: ({ orderId, id, ...body }) => ({
        url: `/orders/${orderId}/notes/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { orderId }) => [{ type: "Notes", id: orderId }],
    }),

    deleteNote: builder.mutation<{ message: string }, { orderId: string; id: number }>({
      query: ({ orderId, id }) => ({
        url: `/orders/${orderId}/notes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { orderId }) => [{ type: "Notes", id: orderId }],
    }),
  }),
});

export const { useFetchOrdersQuery, useFetchOrderQuery, useFetchCodeBookQuery, useFetchCodeBookByCodeQuery, useUpdateOrderRushMutation, useUpdateOrderMutation, useCreateOrderMutation, useUploadFileMutation, useUpdateOrderChainFileMutation, useCreateCodeBookMutation, useUpdateCodeBookMutation, useDeleteCodeBookMutation, useDeleteOrderMutation, useSearchCodeBookQuery, useLazySearchCodeBookQuery, useCreateTaxCertMutation, useDeleteTaxCertMutation, usePatchTaxCertMutation, useCreateTsriExceptionMutation, useDeleteTsriExceptionMutation, usePatchTsriExceptionMutation, useCreateTsriRequirementMutation, useDeleteTsriRequirementMutation, usePatchTsriRequirementMutation, useCreateTractMapMutation, useCreateAssessorMapMutation, useCreateRunsheetMutation, useCreateStarterMutation, useDeleteStarterMutation, useCreateTitleChainDocMutation, useDeleteTitleChainReviewMutation, useDeleteTractMapMutation, useDeleteAssessorMapMutation, useDeleteRunsheetMutation, usePatchAssessorMapMutation, usePatchTractMapMutation, usePatchRunsheetMutation, usePatchStarterMutation, usePatchTitleChainReviewMutation, useReorderTsriExceptionsMutation, useReorderTsriRequirementsMutation, useReorderTaxCertsMutation, useFetchNotesQuery, useCreateNoteMutation, useUpdateNoteMutation, useDeleteNoteMutation } = ordersApi
