import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import {
  getSecureInfo,
  rmeoveSecureInfo,
  setSecureInfo,
} from "../utils/secureStore";
import { SECURE_STRINGS } from "../utils/secureStore/strings";
import { StackActions } from "@react-navigation/native";
// import {updateToken} from '@services/utils';
import { MAIN_NAV_STRINGS } from "../navigation/constants";
import { navigationRef } from "../../App";
import { BASE_URL } from "@env";

const axiosPrivate = axios.create({
  baseURL: BASE_URL,
});
const axiosAuth = axios.create({
  baseURL: BASE_URL,
});

axiosAuth.interceptors.request.use((request: InternalAxiosRequestConfig) => {
  return request;
});
axiosAuth.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: any) => {
    console.log({ error: error.response });
    // showCustomToast(error.response.data.message, "danger");
    return Promise.reject(error.response.data);
  }
);

export { axiosAuth };

interface Global {
  is403Navigated: boolean;
}
const getRefreshToken = async () => {
  try {
    const refreshToken = await getSecureInfo(SECURE_STRINGS.REFRESH_TOKEN);
    let params = {
      refresh: refreshToken,
    };
    // const response: any = await updateToken(params);
    // if (response?.status && response?.data?.access) {
    //   return response?.data?.access;
    // }
    return false;
  } catch (error) {
    return false;
  }
};
const logout = async () => {
  await rmeoveSecureInfo(SECURE_STRINGS.ACCESS_TOKEN);
  await rmeoveSecureInfo(SECURE_STRINGS.REFRESH_TOKEN);
  await rmeoveSecureInfo(SECURE_STRINGS.USER_INFO);
  navigationRef.current?.dispatch(
    StackActions.replace(MAIN_NAV_STRINGS.AUTHSTACK)
  );
  (global as unknown as Global).is403Navigated = true;
};

axiosPrivate.interceptors.request.use(
  async (request: InternalAxiosRequestConfig) => {
    let accessToken: string = await getSecureInfo(SECURE_STRINGS.ACCESS_TOKEN);

    request.headers.Authorization = `Bearer ${accessToken}`;
    request.headers["api-version"] = "v2";
    request.headers.Accept = "application/json";
    if (request.headers["Content-Type"] === "formData") {
      request.headers["Content-Type"] = "multipart/form-data";
    } else {
      request.headers["Content-Type"] = "application/json";
    }
    request.headers["Access-Control-Allow-Methods"] =
      "GET, PUT, POST, DELETE, OPTIONS,PATCH";

    return request;
  },
  (error: AxiosError) => {
    console.log("intercept request error", error);
  }
);

axiosPrivate.interceptors.response.use(
  async (response: AxiosResponse) => {
    (global as unknown as Global).is403Navigated = true;
    return response;
  },
  async (error: any) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 403 &&
      error.code === "token_not_valid" &&
      !originalRequest._retry &&
      !(global as unknown as Global).is403Navigated
    ) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await getRefreshToken();
        if (newAccessToken) {
          await setSecureInfo(SECURE_STRINGS.ACCESS_TOKEN, newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosPrivate(originalRequest);
        } else {
          await logout();
        }
      } catch (refreshError) {
        await logout();
      }
    }
    return Promise.reject(error.response.data);
  }
);
export default axiosPrivate;
