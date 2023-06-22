import { login, refreshToken, logoutUser } from "../apis/auth";
import { apiGetUserPrivateByUserId } from "../apis/user";
import { isLoading, loginSuccess, loginFailed, clearUser } from "./authSlice";

// Create an async thunk for logging in
export const loginFetch = async (user, dispatch, navigate) => {
  dispatch(isLoading());
  try {
    const response = await login(user);
    if (response?.data?.roleId?.name === "admin") {
      dispatch(loginSuccess(response?.data));
      localStorage.setItem("accessToken", response?.data?.accessToken);
      localStorage.setItem("refreshToken", response?.data?.refreshToken);
      navigate("/");
    } else {
      dispatch(loginFailed({ message: "you do not have access" }));
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
  } catch (error) {
    dispatch(loginFailed(error.response?.data));
  }
};

// Create an async thunk for logging in
export const checkRefreshTokenFetch = async (dispatch) => {
  try {
    const refreshTokenGet = await localStorage.getItem("refreshToken");
    const response = await refreshToken({ refreshToken: refreshTokenGet });
    localStorage.setItem("accessToken", response.data.accessToken);
    localStorage.setItem("refreshToken", response.data.refreshToken);
    refreshUserFetch(dispatch);
  } catch (error) {
    dispatch(clearUser());
    console.log(error);
  }
};

export const logoutUserFetch = async (
  dispatch,
  navigate,
  setIsLogoutLoading
) => {
  try {
    const refreshTokenGet = await localStorage.getItem("refreshToken");
    await logoutUser({ refreshToken: refreshTokenGet });
    dispatch(clearUser());
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.clear();
    setIsLogoutLoading(false);
    navigate("/login");
  } catch (error) {
    setIsLogoutLoading(false);
    console.log(error);
  }
};

// Create an async thunk for logging in
export const refreshUserFetch = async (dispatch) => {
  try {
    const response = await apiGetUserPrivateByUserId();
    dispatch(loginSuccess(response.data.user));
  } catch (error) {
    console.log(error);
  }
};
