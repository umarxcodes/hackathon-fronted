import { format, isValid, parseISO } from "date-fns";

export function formatDate(value, pattern = "MMM d, yyyy") {
  if (!value) return "N/A";
  const date = typeof value === "string" ? parseISO(value) : new Date(value);
  return isValid(date) ? format(date, pattern) : "N/A";
}

export function todayISO() {
  return format(new Date(), "yyyy-MM-dd");
}
