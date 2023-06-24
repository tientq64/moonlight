import * as Yup from "yup"

export const validationSchema = Yup.object().shape({
   username: Yup.string()
      .required("Username is required"),
   email: Yup.string()
      .email("Invalid email")
      .required("Email is required"),
   password: Yup.string()
      .min(8, "Password contains at least 8 characters")
      .required("Password is required")
})
