import { AxiosResponse } from "axios"
import { Field, Formik, Form as FormikForm, FormikHelpers } from "formik"
import { Button, Container, Form } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { RootState } from "../../store"
import { setUser } from "../../store/reducers/user"
import { IUser } from "../../types"
import { postUsers, postUsersLogin } from "../../utils"
import { validationSchema } from "./validationSchema"

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
               localStorage.setItem("userToken", user.token)
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
