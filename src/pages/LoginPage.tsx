import { useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { Button, Container, Form } from "react-bootstrap"
import { Field, FormikHelpers, Formik, Form as FormikForm } from "formik"
import * as Yup from "yup"

import { setUser } from "../store/reducers/user"
import { postUsersLogin } from "../utils"

export function LoginPage() {
   interface IValues {
      email: string
      password: string
      "email or password"?: string
   }

   const dispatch = useDispatch()
   const navigate = useNavigate()

   const initialValues: IValues = {
      email: "",
      password: ""
   }

   const validationSchema = Yup.object().shape({
      email: Yup.string()
         .email("Invalid email")
         .required("Email is required"),
      password: Yup.string()
         .min(8, "Password contains at least 8 characters")
         .required("Password is required")
   })

   const onSubmitLoginForm = (values: IValues, actions: FormikHelpers<IValues>) => {
      postUsersLogin({ user: values })
         .then((response) => {
            const { user } = response.data
            dispatch(setUser(user))
            localStorage.setItem("userToken", user.token)
            navigate("/")
         })
         .catch((reason) => {
            const { errors } = reason.response.data
            for (const field in errors) {
               const messages = errors[field]
               actions.setFieldError(field, `${field} ${messages[0]}`)
            }
         })
         .finally(() => {
            actions.setSubmitting(false)
         })
   }

   return (
      <Container>
         <div className="row py-4">
            <div className="col-md-6 offset-md-3">
               <div className="fs-1 text-center">Sign in</div>

               <div className="text-center">
                  <Link className="text-decoration-none" to="/register">Need an account?</Link>
               </div>

               <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={onSubmitLoginForm}
               >
                  {({ errors, isSubmitting }) => (
                     <FormikForm>
                        <div className="mt-3">
                           <Field
                              as={Form.Control}
                              name="email"
                              type="email"
                              disabled={isSubmitting}
                              placeholder="Email"
                           />
                        </div>

                        <div className="mt-3">
                           <Field
                              as={Form.Control}
                              name="password"
                              type="password"
                              disabled={isSubmitting}
                              placeholder="Password"
                           />
                        </div>

                        {errors["email or password"] && (
                           <Form.Text className="text-danger">{errors["email or password"]}</Form.Text>
                        )}

                        <div className="d-grid mt-3">
                           <Button type="submit" disabled={isSubmitting}>
                              Sign in
                           </Button>
                        </div>
                     </FormikForm>
                  )}
               </Formik>
            </div>
         </div>
      </Container >
   )
}
