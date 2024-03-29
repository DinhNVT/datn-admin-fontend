import axios from "axios";
import jwt_decode from "jwt-decode";

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // địa chỉ của server nodejs
  headers: {
    "Content-Type": "application/json",
  },
});

const refreshToken = async () => {
  try {
    const refreshTokenGet = await localStorage.getItem("refreshToken");
    const res = await instance.post(
      "/auth/refresh-token",
      { refreshToken: refreshTokenGet },
      {
        withCredentials: true,
      }
    );
    localStorage.setItem("refreshToken", res.data.refreshToken);
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

const instanceJWT = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // địa chỉ của server nodejs
  headers: {
    "Content-Type": "application/json",
  },
});

instanceJWT.interceptors.request.use(
  async (config) => {
    const accessToken = await localStorage.getItem("accessToken");
    let date = new Date();
    const decodedToken = await jwt_decode(accessToken);
    if (decodedToken.exp - 60 < date.getTime() / 1000) {
      const data = await refreshToken();
      localStorage.setItem("accessToken", data.accessToken);
      config.headers.Authorization = `Bearer ${data.accessToken}`;
    } else {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

export { instance, instanceJWT };
