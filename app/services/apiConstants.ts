import { GOOGLE_MAP_API_KEY } from "@env";

export const METHODS = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  PATCH: "PATCH",
  DELETE: "DELETE",
} as const;

export const Endpoints = {
  LOGIN: "login",
  SIGNUP: "signup",
  SOCIAL_SIGNUP: "social/",

  SERVICES: "service-price-item",
  PLACE_COD_ORDER: "placeOrder",
  PLACE_ONLINE_ORDER: "prepare-payment",
  VERIFY_ONLINE_PAMENT: "placeOrder",
  USER_ADDRESS: "user/address",
  USER_PROFILE: "user",
  FACILITY_NEARBY_SEARCH: "find-near-facility",
  USER_MOBILE_NUMBER: "user/send-otp",
  VERIFY_MOBILE_NUMBER: "user/verify-otp",
  CANCEL_ORDER: "report-failure",
  CREATE_USER_ADDRESS: "user/create-address",
  DELETE_USER_ADDRESS: "user/address/",
  SLOTS: "slots",
  COLLECT_FROM: "collect_from",
  ORDERS: "user/orders",
  FETCH_GOOGLE_ADDRESS: (query: string) =>
    `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?fields=formatted_address%2Cname%2Crating%2Copening_hours%2Cgeometry&input=${query}&inputtype=textquery&key=${GOOGLE_MAP_API_KEY}`,
} as const;
