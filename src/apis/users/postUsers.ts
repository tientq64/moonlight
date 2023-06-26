import { axiosApi } from "../axiosApi"

type Data = {
   user: {
      username: string
      email: string
      password: string
   }
}

export const postUsers = (data: Data) => {
   return (
      axiosApi.post("users", data)
   )
}
