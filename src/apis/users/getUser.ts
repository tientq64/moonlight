import { axiosApi } from "../axiosApi"

export const getUser = () => {
   return (
      axiosApi.get("user")
   )
}
