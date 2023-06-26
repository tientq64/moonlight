import * as Yup from "yup"

export const validationSchema = Yup.object().shape({
   title: Yup.string()
      .min(10, "Title must be at least 10 characters")
      .max(200, "Title is only up to 200 characters long")
      .required("Title is required"),

   description: Yup.string()
      .min(20, "Description must be at least 20 characters")
      .max(500, "Description is only up to 500 characters long")
      // .trim("asdasd")
      .required("Description is required"),

   body: Yup.string()
      .min(100, "Body must be at least 50 characters")
      .max(100000, "Body is only up to 100000 characters long")
      .required("Body is required"),

   tagList: Yup.array()
      .max(10, "Tag list is only up to 10 tags")
})
