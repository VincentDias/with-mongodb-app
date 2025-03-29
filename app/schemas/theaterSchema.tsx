import * as yup from "yup";

export const theaterSchema = yup.object({
  street1: yup
    .string()
    .required("Street address is required")
    .max(255, "Street address cannot be longer than 255 characters"),

  city: yup.string().required("City is required").max(30, "City cannot be longer than 30 characters"),

  state: yup
    .string()
    .length(2, "State must be exactly 2 characters")
    .matches(/^[A-Za-z]{2}$/, "State must consist of exactly two letters")
    .required("State is required"),

  zipcode: yup
    .string()
    .matches(/^\d{5}$/, "Zipcode must be exactly 5 digits")
    .required("Zipcode is required"),
});

export async function validateTheater(data: any) {
  try {
    const validatedData = await theaterSchema.validate(data, { abortEarly: false });
    console.log("Validation ok", validatedData);
  } catch (error: any) {
    console.log("Validation error", error.errors);
  }
}
