import { axiosApi } from "."

export const getUser = () => {
   return (
      axiosApi.get("user")
   )
}
