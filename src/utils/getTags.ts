import { axiosApi } from "."

export const getTags = () => {
   return (
      axiosApi.get("tags")
   )
}
