import { ChangeEvent } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Navigate, useNavigate } from "react-router-dom"
import { Button, Col, Container, FloatingLabel, FormControl, FormGroup, FormText, Row } from "react-bootstrap"
import { Formik, Form, FormikHelpers, FormikProps } from "formik"
import { AxiosResponse } from "axios"
import * as Yup from "yup"

import { RootState } from "../store"
import { setUser } from "../store/reducers/user"
import { IUser } from "../types"
import { putUser } from "../utils"

export function SettingsPage() {
   const user: IUser | null = useSelector((state: RootState) => state.user.user)
   const dispatch = useDispatch()

   if (!user) {
      return <Navigate to="/login" replace />
   }

   interface Values {
      image: string
      username: string
      bio: string
      email: string
      password?: string
   }

   const initialValues: Values = {
      image: user.image,
      username: user.username,
      bio: user.bio,
      email: user.email,
      password: ""
   }

   const validationSchema = Yup.object().shape({
      image: Yup.string(),
      username: Yup.string()
         .required("Username is required"),
      bio: Yup.string(),
      email: Yup.string()
         .email("Invalid email")
         .required("Email is required"),
      password: Yup.string()
         .min(8, "Password contains at least 8 characters")
         .optional()
   })

   const handleSubmit = (values: Values, actions: FormikHelpers<Values>) => {
      const newValues: Values = { ...values }
      if (!newValues.password) {
         delete newValues.password
      }
      putUser({ user: newValues })
         .then((response: AxiosResponse) => {
            const newUser: IUser = response.data.user
            dispatch(setUser(newUser))
            localStorage.setItem("userToken", newUser.token)
            // navigate(`/profile/${newUser.username}`)
         })
         .catch((reason) => {
            // console.log(reason)
         })
         .finally(() => {
            actions.setSubmitting(false)
         })
   }

   const handleChangeImage = (setFieldValue: any, event: ChangeEvent) => {
      const target = event.target as HTMLInputElement
      const files: FileList | null = target.files
      if (files?.length) {
         const file = files[0]
         const reader = new FileReader()
         reader.addEventListener("load", (event) => {
            const result = event.target?.result
            if (result) {
               setFieldValue("image", result)
            }
         })
         reader.readAsDataURL(file)
      }
   }

   return (
      <Container className="py-4">
         <div className="fs-3 text-center">Settings</div>

         <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
         >
            {({ values, errors, getFieldProps, dirty, isSubmitting, setFieldValue }: FormikProps<Values>) => (
               <Form>
                  <Row className="gap-3">
                     <Col md="auto" className="mt-4 text-center">
                        <label className="cursor-pointer" htmlFor="image">
                           <img
                              key={values.image}
                              className="img-thumbnail animate__animated animate__bounceIn"
                              src={values.image}
                              width={280}
                              alt="Avatar"
                           />
                        </label>
                     </Col>
                     <Col>
                        <FormGroup className="mt-3">
                           <div className="fw-semibold">Image</div>
                           <FormControl
                              id="image"
                              name="image"
                              type="file"
                              accept="image/*"
                              disabled={isSubmitting}
                              onChange={handleChangeImage.bind(null, setFieldValue)}
                           />
                           {errors.image && (
                              <FormControl.Feedback type="invalid">
                                 {errors.image}
                              </FormControl.Feedback>
                           )}
                        </FormGroup>

                        <FormGroup className="mt-3">
                           <div className="fw-semibold">Username</div>
                           <FormControl
                              {...getFieldProps("username")}
                              name="username"
                              disabled={isSubmitting}
                              placeholder="Username"
                           />
                           {errors.username && (
                              <FormControl.Feedback type="invalid">
                                 {errors.username}
                              </FormControl.Feedback>
                           )}
                        </FormGroup>

                        <FormGroup className="mt-3">
                           <div className="fw-semibold">Bio</div>
                           <FormControl
                              {...getFieldProps("bio")}
                              as="textarea"
                              style={{ height: 160 }}
                              disabled={isSubmitting}
                              placeholder="Short bio about you"
                           />
                        </FormGroup>

                        <FormGroup className="mt-3">
                           <div className="fw-semibold">Email</div>
                           <FormControl
                              {...getFieldProps("email")}
                              type="email"
                              disabled={isSubmitting}
                              placeholder="Email"
                           />
                           {errors.email && (
                              <FormControl.Feedback type="invalid">
                                 {errors.email}
                              </FormControl.Feedback>
                           )}
                        </FormGroup>

                        <FormGroup className="mt-3">
                           <div className="fw-semibold">New password</div>
                           <FormControl
                              {...getFieldProps("password")}
                              type="password"
                              disabled={isSubmitting}
                              placeholder="New password"
                           />
                           {errors.password && (
                              <FormControl.Feedback type="invalid">
                                 {errors.password}
                              </FormControl.Feedback>
                           )}
                        </FormGroup>

                        <FormGroup className="mt-3 text-end">
                           <Button type="submit" disabled={isSubmitting || !dirty}>
                              Update settings
                           </Button>
                        </FormGroup>
                     </Col>
                  </Row>
               </Form>
            )}
         </Formik>
      </Container>
   )
}
