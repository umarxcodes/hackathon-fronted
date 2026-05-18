import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const aiApi = createApi({
  reducerPath: "aiApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    symptomChecker: builder.mutation({
      query: (body) => ({ url: "/ai/symptom-checker", method: "POST", body }),
    }),
    prescriptionExplanation: builder.mutation({
      query: (body) => ({
        url: "/ai/prescription-explanation",
        method: "POST",
        body,
      }),
    }),
    riskFlag: builder.mutation({
      query: (body) => ({ url: "/ai/risk-flag", method: "POST", body }),
    }),
  }),
});
export const {
  useSymptomCheckerMutation,
  usePrescriptionExplanationMutation,
  useRiskFlagMutation,
} = aiApi;
