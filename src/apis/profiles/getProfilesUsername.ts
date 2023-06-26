import { axiosApi } from "../axiosApi"

export const getProfilesUsername = (username: string) => {
   return (
      axiosApi.get(`profiles/${username}`)
   )
}
