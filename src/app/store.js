import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import { authApi } from "../features/auth/authApi";
import { usersApi } from "../features/users/usersApi";
import { patientsApi } from "../features/patients/patientsApi";
import { appointmentsApi } from "../features/appointments/appointmentsApi";
import { prescriptionsApi } from "../features/prescriptions/prescriptionsApi";
import { aiApi } from "../features/ai/aiApi";
import { analyticsApi } from "../features/analytics/analyticsApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [patientsApi.reducerPath]: patientsApi.reducer,
    [appointmentsApi.reducerPath]: appointmentsApi.reducer,
    [prescriptionsApi.reducerPath]: prescriptionsApi.reducer,
    [aiApi.reducerPath]: aiApi.reducer,
    [analyticsApi.reducerPath]: analyticsApi.reducer,
  },
  middleware: (gDM) =>
    gDM().concat(
      authApi.middleware,
      usersApi.middleware,
      patientsApi.middleware,
      appointmentsApi.middleware,
      prescriptionsApi.middleware,
      aiApi.middleware,
      analyticsApi.middleware
    ),
});
