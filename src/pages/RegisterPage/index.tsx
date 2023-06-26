import { Formik, FormikHelpers } from "formik"
import { Button, Container, Form, FormControl, FormGroup, Spinner } from "react-bootstrap"
import { Link, Navigate } from "react-router-dom"
import { toast } from "react-toastify"
import { postUsers, postUsersLogin } from "../../apis"
import { FormControlError } from "../../components"
import { useUser } from "../../hooks"
import { IUser } from "../../types"
import { validationSchema } from "./validationSchema"

interface Values {
   username: string
   email: string
   password: string
   confirmPassword: string
}

export function RegisterPage() {
   const [user, setUser] = useUser()

   const initialValues: Values = {
      username: "",
      email: "",
      password: "",
      confirmPassword: ""
   }

   const onSubmitRegisterForm = (values: Values, actions: FormikHelpers<Values>) => {
      postUsers({ user: values })
         .then((response) => {
            toast("Registered successfully", { type: "success" })

            postUsersLogin({
               user: {
                  email: values.email,
                  password: values.password
               }
            })
               .then((response) => {
                  const newUser: IUser = response.data.user
                  setUser(newUser)
               })
               .catch((reason) => {
                  actions.setSubmitting(false)
                  toast(reason.message, { type: "error" })
               })
         })
         .catch((reason) => {
            actions.setSubmitting(false)
            const { errors } = reason.response.data
            for (const field in errors) {
               const messages = errors[field]
               actions.setFieldError(field, `${field} ${messages[0]}`)
            }
         })
   }

   if (user) {
      return <Navigate to="/" replace />
   }

   return (
      <Container>
         <div className="row py-5">
            <div className="col-md-6 offset-md-3">
               <div className="fs-1 text-center">Sign up</div>

               <div className="text-center">
                  <Link className="text-decoration-none" to="/login">Have an account?</Link>
               </div>

               <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={onSubmitRegisterForm}
               >
                  {({ getFieldProps, handleSubmit, isSubmitting }) => (
                     <Form onSubmit={handleSubmit}>
                        <FormGroup className="mt-3">
                           <div className="fw-semibold">Username</div>
                           <FormControl
                              {...getFieldProps("username")}
                              disabled={isSubmitting}
                           />
                           <FormControlError name="username" />
                        </FormGroup>

                        <FormGroup className="mt-3">
                           <div className="fw-semibold">Email</div>
                           <FormControl
                              {...getFieldProps("email")}
                              type="email"
                              disabled={isSubmitting}
                           />
                           <FormControlError name="email" />
                        </FormGroup>

                        <FormGroup className="mt-3">
                           <div className="fw-semibold">Password</div>
                           <FormControl
                              {...getFieldProps("password")}
                              type="password"
                              disabled={isSubmitting}
                           />
                           <FormControlError name="password" />
                        </FormGroup>

                        <FormGroup className="mt-3">
                           <div className="fw-semibold">Confirm password</div>
                           <FormControl
                              {...getFieldProps("confirmPassword")}
                              type="password"
                              disabled={isSubmitting}
                           />
                           <FormControlError name="confirmPassword" />
                        </FormGroup>

                        <div className="d-grid mt-4">
                           <Button type="submit" disabled={isSubmitting}>
                              {isSubmitting && (
                                 <Spinner className="me-2" size="sm" />
                              )}
                              Sign up
                           </Button>
                        </div>
                     </Form>
                  )}
               </Formik>
            </div>
         </div>
      </Container >
   )
}
