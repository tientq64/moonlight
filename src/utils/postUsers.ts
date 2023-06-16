import { axiosApi } from "."

interface IData {
   user: {
      username: string
      email: string
      password: string
   }
}

export const postUsers = (data: IData) => {
   return (
      axiosApi.post("users", data)
   )
}
