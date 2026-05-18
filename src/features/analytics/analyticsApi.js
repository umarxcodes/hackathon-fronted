import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const analyticsApi = createApi({
  reducerPath: "analyticsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getAdminAnalytics: builder.query({ query: () => "/analytics/admin" }),
    getDoctorAnalytics: builder.query({ query: () => "/analytics/doctor" }),
  }),
});
export const { useGetAdminAnalyticsQuery, useGetDoctorAnalyticsQuery } =
  analyticsApi;
