import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});
export const prescriptionsApi = createApi({
  reducerPath: "prescriptionsApi",
  baseQuery,
  tagTypes: ["Prescription"],
  endpoints: (builder) => ({
    getPrescriptions: builder.query({
      query: () => "/prescriptions",
      providesTags: ["Prescription"],
    }),
    getPrescription: builder.query({
      query: (id) => `/prescriptions/${id}`,
      providesTags: (r, e, id) => [{ type: "Prescription", id }],
    }),
    createPrescription: builder.mutation({
      query: (body) => ({ url: "/prescriptions", method: "POST", body }),
      invalidatesTags: ["Prescription"],
    }),
    updatePrescription: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/prescriptions/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Prescription"],
    }),
  }),
});
export const {
  useGetPrescriptionsQuery,
  useGetPrescriptionQuery,
  useCreatePrescriptionMutation,
  useUpdatePrescriptionMutation,
} = prescriptionsApi;
