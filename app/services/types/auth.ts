export interface LoginRequest {
  email: string;
  password: string;
  device_id: string;
  device_os: string;
  fcm_token: string;
}
export interface SignupRequest {
  email: string;
  name: string;
  password: string;
  type: "custom" | "google" | "facebook";
  device_id: string;
  device_os: string;
  fcm_token: string;
}
export interface SocialSignupRequest {
  provider_token: string;
  name: string;
  email: string;
  profile: string;
  device_id: string;
  device_os: string;
  fcm_token: string;
}
export interface LoginResponse {
  status: boolean;
  message: string;
  data: {
    user: {
      id: number;
      user_identifier: number;
      name: string;
      email: string;
      email_verified_at: null;
      user_type_id: null;
      mobile: string;
    };
    access_token: string;
    token_type: string;
  };
}
export interface SignupResponse {
  status_code: number;
  status: boolean;
  message: string;
  data: {
    user: {
      id: number;
      user_identifier: number;
      name: string;
      email: string;
      email_verified_at: null;
      mobile: string;
    };
    access_token: string;
    token_type: string;
  };
}
