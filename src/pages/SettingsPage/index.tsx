import { AxiosResponse } from "axios"
import { Formik, FormikHelpers, FormikProps } from "formik"
import { ChangeEvent } from "react"
import { Button, Col, Container, Form, FormControl, FormGroup, Row } from "react-bootstrap"
import { Navigate } from "react-router-dom"
import { toast } from "react-toastify"
import { IUser, UpdateUser, useUpdateCurrentUser } from "../../apis"
import { FormControlError } from "../../components"
import { useUser } from "../../hooks"
import { validationSchema } from "./validationSchema"

type Values = UpdateUser

export function SettingsPage() {
   const [user, setUser] = useUser()
   const updateCurrentUser = useUpdateCurrentUser()

   if (!user) {
      return <Navigate to="/login" replace />
   }

   const initialValues: Values = {
      image: user.image,
      username: user.username,
      bio: user.bio ?? "",
      email: user.email,
      password: ""
   }

   const handleSubmit = (values: Values, actions: FormikHelpers<Values>) => {
      const updateUser: UpdateUser = { ...values }

      if (!updateUser.password) {
         delete updateUser.password
      }

      updateCurrentUser({ user: updateUser })
         .then((response: AxiosResponse) => {
            const newUser: IUser = response.data.user
            setUser(newUser)
            actions.setFieldValue("password", "")
            toast("Update profile information successfully", { type: "success" })
         })
         .catch((reason) => {
            toast(reason.response.data, { type: "error" })
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

         if (file.type.startsWith("image/")) {
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
   }

   return (
      <Container className="py-4">
         <div className="fs-3 text-center">Settings</div>

         <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
         >
            {({ values, getFieldProps, isSubmitting, setFieldValue, handleSubmit }: FormikProps<Values>) => (
               <Form onSubmit={handleSubmit}>
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
                           <FormControlError name="image" />
                        </FormGroup>

                        <FormGroup className="mt-3">
                           <div className="fw-semibold">Username</div>
                           <FormControl
                              {...getFieldProps("username")}
                              name="username"
                              disabled={isSubmitting}
                              placeholder="Username"
                           />
                           <FormControlError name="username" />
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
                           <FormControlError name="email" />
                        </FormGroup>

                        <FormGroup className="mt-3">
                           <div className="fw-semibold">New password</div>
                           <FormControl
                              {...getFieldProps("password")}
                              type="password"
                              disabled={isSubmitting}
                              placeholder="New password"
                           />
                           <FormControlError name="password" />
                        </FormGroup>

                        <FormGroup className="mt-3 text-end">
                           <Button type="submit" disabled={isSubmitting}>
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
