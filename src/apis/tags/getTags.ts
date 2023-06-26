import { axiosApi } from "../axiosApi"

export const getTags = () => {
   return (
      axiosApi.get("tags")
   )
}
