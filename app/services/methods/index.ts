import { Endpoints } from "../apiConstants";
import { axiosAuth } from "../apiInstance";
import {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
  SocialSignupRequest,
} from "../types/auth";

export const userLogin = async (data: LoginRequest) => {
  return await axiosAuth.post<LoginResponse>(Endpoints.LOGIN, data);
};

export const userSignup = async (data: SignupRequest) => {
  return await axiosAuth.post<SignupResponse>(Endpoints.SIGNUP, data);
};
export const userSocialSignup = async (
  data: SocialSignupRequest,
  provider: string = ""
) => {
  return await axiosAuth.post<SignupResponse>(
    Endpoints.SOCIAL_SIGNUP + provider,
    data
  );
};
