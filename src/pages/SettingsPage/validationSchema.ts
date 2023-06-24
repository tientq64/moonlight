import * as Yup from "yup"

export const validationSchema = Yup.object().shape({
   image: Yup.string(),
   username: Yup.string()
      .required("Username is required"),
   bio: Yup.string(),
   email: Yup.string()
      .email("Invalid email")
      .required("Email is required"),
   password: Yup.string()
      .min(8, "Password contains at least 8 characters")
      .optional()
})
