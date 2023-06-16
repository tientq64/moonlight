import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { Button, Container, Form } from "react-bootstrap"
import { Field, FormikHelpers, Formik, Form as FormikForm } from "formik"
import * as Yup from "yup"

import { postUsers, postUsersLogin } from "../utils"
import { RootState } from "../store"
import { setUser } from "../store/reducers/user"
import { IUser } from "../types"
import { AxiosResponse } from "axios"

export function RegisterPage() {
   interface IValues {
      username: string
      email: string
      password: string
   }

   const user: IUser | null = useSelector((state: RootState) => state.user.user)
   const dispatch = useDispatch()
   const navigate = useNavigate()

   const initialValues: IValues = {
      username: "",
      email: "",
      password: ""
   }

   const validationSchema = Yup.object().shape({
      username: Yup.string()
         .required("Username is required"),
      email: Yup.string()
         .email("Invalid email")
         .required("Email is required"),
      password: Yup.string()
         .min(8, "Password contains at least 8 characters")
         .required("Password is required")
   })

   const onSubmitRegisterForm = (values: IValues, actions: FormikHelpers<IValues>) => {
      postUsers({ user: values })
         .then((response: AxiosResponse<{ user: any}>) => {
            const { user } = response.data
            postUsersLogin({
               user: {
                  email: values.email,
                  password: values.password
               }
            }).then((response) => {

               dispatch(setUser(user))
               localStorage.userToken = user.token
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
         <div className="row py-4">
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
                  {({ values, errors }) => (
                     <FormikForm>
                        <div className="mt-3">
                           <Field as={Form.Control} name="username" placeholder="Username" />
                           {errors.username && (
                              <Form.Text className="text-danger">{errors.username}</Form.Text>
                           )}
                        </div>

                        <div className="mt-3">
                           <Field as={Form.Control} name="email" type="email" placeholder="Email" />
                           {errors.email && (
                              <Form.Text className="text-danger">{errors.email}</Form.Text>
                           )}
                        </div>

                        <div className="mt-3">
                           <Field as={Form.Control} name="password" type="password" placeholder="Password" />
                           {errors.password && (
                              <Form.Text className="text-danger">{errors.password}</Form.Text>
                           )}
                        </div>

                        <div className="d-grid mt-3">
                           <Button type="submit">Sign up</Button>
                        </div>
                     </FormikForm>
                  )}
               </Formik>
            </div>
         </div>
      </Container >
   )
}
