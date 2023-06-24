import { axiosApi } from "../.."

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
