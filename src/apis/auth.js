import { instance } from "../utils/api";

export const login = (user) =>
  instance.post("/auth/login", user, {
    withCredentials: true,
  });

export const refreshToken = () =>
  instance.post(
    "/auth/refresh-token",
    {},
    {
      withCredentials: true,
    }
  );
  
export const logoutUser = () =>
  instance.post(
    "/auth/logout",
    {},
    {
      withCredentials: true,
    }
  );
