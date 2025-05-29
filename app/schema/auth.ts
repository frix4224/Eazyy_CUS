import { object, string } from "yup";

export const LoginSchema = object().shape({
  email: string()
    .email("please enter a valid email address")
    .required("please enter your email address"),
  password: string()
    .required("please enter password")
    .min(8, "please enter password at least 8 characters"),
});

export const SignupSchema = object().shape({
  fullName: string().required("please enter your full name"),
  email: string()
    .email("please enter a valid email address")
    .required("please enter your email address"),
  password: string()
    .required("please enter password")
    .min(8, "please enter password at least 8 characters"),
});

export const EditProfileSchema = object().shape({
  name: string().required("please enter your name address"),
  mobileNumber: string()
    .required("please enter mobile number")
    .max(10, "please enter mobile number at most 10 characters")
    .min(10, "please enter mobile number at least 10 characters"),
});
