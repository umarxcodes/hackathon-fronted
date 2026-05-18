import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});
export const patientsApi = createApi({
  reducerPath: "patientsApi",
  baseQuery,
  tagTypes: ["Patient"],
  endpoints: (builder) => ({
    getPatients: builder.query({
      query: ({ page = 1, limit = 10, search = "" } = {}) =>
        `/patients?page=${page}&limit=${limit}${search ? `&search=${encodeURIComponent(search)}` : ""}`,
      providesTags: ["Patient"],
    }),
    getPatient: builder.query({
      query: (id) => `/patients/${id}`,
      providesTags: (r, e, id) => [{ type: "Patient", id }],
    }),
    getTimeline: builder.query({ query: (id) => `/patients/${id}/timeline` }),
    createPatient: builder.mutation({
      query: (body) => ({ url: "/patients", method: "POST", body }),
      invalidatesTags: ["Patient"],
    }),
    updatePatient: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/patients/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Patient"],
    }),
    deletePatient: builder.mutation({
      query: (id) => ({ url: `/patients/${id}`, method: "DELETE" }),
      invalidatesTags: ["Patient"],
    }),
  }),
});
export const {
  useGetPatientsQuery,
  useGetPatientQuery,
  useGetTimelineQuery,
  useCreatePatientMutation,
  useUpdatePatientMutation,
  useDeletePatientMutation,
} = patientsApi;
