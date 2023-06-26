import { axiosApi } from "../axiosApi"

export type PostUserLoginData = {
   user: {
      email: string
      password: string
   }
}

export const postUsersLogin = (data: PostUserLoginData) => {
   return (
      axiosApi.post("users/login", data)
   )
}
