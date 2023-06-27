import { Formik, FormikHelpers } from "formik"
import { Button, Container, Form, FormControl, FormGroup, Spinner } from "react-bootstrap"
import { Link, Navigate, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { LoginUser, useLogin } from "../../apis"
import { FormControlError } from "../../components"
import { useUser } from "../../hooks"
import { validationSchema } from "./validationSchema"

interface Values extends LoginUser {}

export function LoginPage() {
   const [user, setUser] = useUser()
   const navigate = useNavigate()

   const login = useLogin()

   const initialValues: Values = {
      email: "",
      password: ""
   }

   const onSubmitLoginForm = (values: Values, actions: FormikHelpers<Values>) => {
      login({ user: values })
         .then((response) => {
            setUser(response.data.user)
            navigate(-1)
         })
         .catch((reason) => {
            const { errors } = reason.response.data
            for (const field in errors) {
               const messages = errors[field]
               toast(`${field} ${messages[0]}`, {
                  type: "error"
               })
            }
         })
         .finally(() => {
            actions.setSubmitting(false)
         })
   }

   if (user) {
      return <Navigate to="/" replace />
   }

   return (
      <Container>
         <div className="row py-5">
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
                  {({ isSubmitting, handleSubmit, getFieldProps }) => (
                     <Form onSubmit={handleSubmit}>
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

                        <div className="d-grid mt-4">
                           <Button type="submit" disabled={isSubmitting}>
                              {isSubmitting && (
                                 <Spinner className="me-2" size="sm" />
                              )}
                              Sign in
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
