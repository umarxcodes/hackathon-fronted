export const getItems = (response) =>
  response?.data?.items || response?.data || [];
export const getPayload = (response) => response?.data || response || {};
export const getId = (item) => item?._id || item?.id;
export const titleCase = (value = "") =>
  value ? `${value}`.charAt(0).toUpperCase() + `${value}`.slice(1) : "N/A";
export const initials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "U";
export const getApiError = (error, fallback = "Something went wrong") =>
  error?.data?.error || error?.error || error?.message || fallback;
export const patientName = (record) =>
  record?.patientId?.name ||
  record?.patient?.name ||
  record?.patientName ||
  "Patient";
export const doctorName = (record) =>
  record?.doctorId?.name ||
  record?.doctor?.name ||
  record?.doctorName ||
  "Doctor";
