import * as Yup from "yup"

export const commentSchema = Yup.object().shape({
   body: Yup.string()
      .trim()
      .required()
})
