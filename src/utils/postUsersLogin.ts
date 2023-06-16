import { axiosApi } from "."

export interface IPostUserLoginData {
   user: {
      email: string
      password: string
   }
}

export const postUsersLogin = (data: IPostUserLoginData) => {
   return (
      axiosApi.post("users/login", data)
   )
}
