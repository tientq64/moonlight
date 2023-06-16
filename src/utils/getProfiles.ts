import { axiosApi } from "."

export const getProfiles = (username: string) => {
   return (
      axiosApi.get(`profiles/${username}`)
   )
}
