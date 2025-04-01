import * as yup from "yup";

export const signUpSchema = yup.object({
  name: yup.string().required("Name is required").max(100, "Name must be at most 40 characters").min(6),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required")
    .max(100, "Email must be at most 60 characters"),
  password: yup.string().required("Password is required"),
});

export const loginSchema = yup.object({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required")
    .max(100, "Email must be at most 60 characters"),
  password: yup.string().required("Password is required"),
});
