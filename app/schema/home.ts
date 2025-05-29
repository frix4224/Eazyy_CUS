import { object, string } from "yup";

export const addAddressSchema = object().shape({
  fullName: string().required("please enter your full name"),
  houseNumber: string().required("please enter your house number"),
  street: string().required("please enter your street"),
  area: string().required("please enter your area"),
  city: string().required("please enter your city"),
  state: string().required("please enter your state"),
  country: string().required("please enter your country"),
  pincode: string().required("please enter your pincode"),
});
