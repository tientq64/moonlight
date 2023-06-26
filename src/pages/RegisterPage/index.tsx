import { Field, Formik, FormikHelpers } from "formik"
import { Button, Container, Form, FormControl, FormGroup, FormText } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import { FormControlError } from "../../components"
import { IUser } from "../../types"
import { postUsers, postUsersLogin, useUser } from "../../utils"
import { validationSchema } from "./validationSchema"

interface Values {
   username: string
   email: string
   password: string
}

export function RegisterPage() {
   const [user, setUser] = useUser()
   const navigate = useNavigate()

   const initialValues: Values = {
      username: "",
      email: "",
      password: ""
   }

   const onSubmitRegisterForm = (values: Values, actions: FormikHelpers<Values>) => {
      postUsers({ user: values })
         .then((response) => {
            postUsersLogin({
               user: {
                  email: values.email,
                  password: values.password
               }
            }).then((response) => {
               const newUser: IUser = response.data.user
               setUser(newUser)
               localStorage.setItem("userToken", newUser.token)
               navigate("/")
            })
         })
         .catch((reason) => {
            const { errors } = reason.response.data
            for (const field in errors) {
               const messages = errors[field]
               actions.setFieldError(field, `${field} ${messages[0]}`)
            }
         })
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
                  {({ errors, getFieldProps, handleSubmit, isSubmitting }) => (
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

                        <div className="d-grid mt-4">
                           <Button type="submit">Sign up</Button>
                        </div>
                     </Form>
                  )}
               </Formik>
            </div>
         </div>
      </Container >
   )
}
