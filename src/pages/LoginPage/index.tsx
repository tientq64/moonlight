import { Field, Formik, Form as FormikForm, FormikHelpers } from "formik"
import { Button, Container, Form } from "react-bootstrap"
import { useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { setUser } from "../../store/reducers/user"
import { postUsersLogin } from "../../utils"
import { validationSchema } from "./validationSchema"

export function LoginPage() {
   type Values = {
      email: string
      password: string
      "email or password"?: string
   }

   const dispatch = useDispatch()
   const navigate = useNavigate()

   const initialValues: Values = {
      email: "",
      password: ""
   }

   const onSubmitLoginForm = (values: Values, actions: FormikHelpers<Values>) => {
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
