import { Form, Formik, FormikHelpers } from "formik"
import { Button, Container, FormControl, FormGroup, FormLabel, InputGroup } from "react-bootstrap"
import { useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { FormControlError } from "../../components"
import { setUser } from "../../store/reducers/user"
import { postUsersLogin } from "../../utils"
import { validationSchema } from "./validationSchema"

interface Values {
   email: string
   password: string
}

interface Errors {
   "email or password": string
}

export function LoginPage() {
   const dispatch = useDispatch()
   const navigate = useNavigate()

   const initialValues: Values = {
      email: "",
      password: ""
   }

   const initialErrors: Errors = {
      "email or password": ""
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
         <div className="row py-5">
            <div className="col-md-6 offset-md-3">
               <div className="fs-1 text-center">Sign in</div>

               <div className="text-center">
                  <Link className="text-decoration-none" to="/register">Need an account?</Link>
               </div>

               <Formik
                  initialValues={initialValues}
                  initialErrors={initialErrors}
                  validationSchema={validationSchema}
                  onSubmit={onSubmitLoginForm}
               >
                  {({ errors, isSubmitting, getFieldProps }) => (
                     <Form>
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

                        <FormControlError name="['email or password']" />

                        <div className="d-grid mt-4">
                           <Button type="submit" disabled={isSubmitting}>
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
