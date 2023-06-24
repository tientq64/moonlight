import { ErrorMessage } from "formik"
import { FormControl } from "react-bootstrap"

type Props = {
   name: string
}

export const FormControlError = ({ name }: Props) => {
   return (
      <FormControl.Feedback className="d-block" type="invalid">
         <ErrorMessage name={name} />
      </FormControl.Feedback>
   )
}
