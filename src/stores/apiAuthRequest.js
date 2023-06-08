import { login, refreshToken, logoutUser } from "../apis/auth";
import { apiGetUserPrivateByUserId } from "../apis/user";
import { isLoading, loginSuccess, loginFailed, clearUser } from "./authSlice";

// Create an async thunk for logging in
export const loginFetch = async (user, dispatch, navigate) => {
  dispatch(isLoading());
  try {
    const response = await login(user);
    if (response.data.roleId.name === "admin") {
      dispatch(loginSuccess(response.data));
      localStorage.setItem("accessToken", response?.data?.accessToken);
      navigate("/");
    } else {
      dispatch(loginFailed({ message: "you do not have access" }));
      localStorage.removeItem("accessToken");
    }
  } catch (error) {
    dispatch(loginFailed(error.response.data));
  }
};

// Create an async thunk for logging in
export const checkRefreshTokenFetch = async (dispatch) => {
  try {
    const response = await refreshToken();
    localStorage.setItem("accessToken", response.data.accessToken);
    refreshUserFetch();
  } catch (error) {
    if (
      error.response &&
      error.response.status >= 400 &&
      error.response.status < 500
    ) {
      localStorage.removeItem("accessToken");
      dispatch(clearUser());
    }
    console.log(error);
  }
};

export const logoutUserFetch = async (
  dispatch,
  navigate,
  setIsLogoutLoading
) => {
  try {
    await logoutUser();
    dispatch(clearUser());
    localStorage.removeItem("accessToken");
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
