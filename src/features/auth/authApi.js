import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
    }),
    register: builder.mutation({
      query: (body) => ({ url: "/auth/register", method: "POST", body }),
    }),
    getMe: builder.query({ query: () => "/auth/me" }),
    logoutUser: builder.mutation({
      query: () => ({ url: "/auth/logout", method: "GET" }),
    }),
  }),
});
export const {
  useLoginMutation,
  useRegisterMutation,
  useGetMeQuery,
  useLogoutUserMutation,
} = authApi;
