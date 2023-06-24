import { axiosApi } from "../.."

export const getProfilesUsername = (username: string) => {
   return (
      axiosApi.get(`profiles/${username}`)
   )
}
