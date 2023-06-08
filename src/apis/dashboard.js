import { instanceJWT } from "../utils/api";

export const apiGetPostPerDay = () =>
  instanceJWT.get("/dashboard/post-per-day");
export const apiGetCountDashboard = () =>
  instanceJWT.get("/dashboard/count-dashboard");
export const apiGetLatestUsers = (limit) =>
  instanceJWT.get(`/dashboard/latest-user?limit=${limit}`);
export const apiGetPostCountByStatus = () =>
  instanceJWT.get("/dashboard/post-count/by-status");
export const apiGetUserCountByRole = () =>
  instanceJWT.get("/dashboard/user-count/by-role");
