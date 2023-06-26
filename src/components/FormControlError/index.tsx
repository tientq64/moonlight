import { FormikContextType, connect, getIn } from "formik"
import { FormControl } from "react-bootstrap"

type Props = {
   name: string,
   formik?: FormikContextType<{}>
}

export const FormControlError = connect(({ name, formik }: Props) => {
   if (!formik) return null

   const error = getIn(formik.errors, name)
   const touched = getIn(formik.touched, name) || !Object.hasOwn(formik.values, name)

   return (
      touched && error ? (
         <FormControl.Feedback className="d-block" type="invalid">
            {error}
         </FormControl.Feedback>
      ) : null
   )
})
