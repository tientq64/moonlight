import { axiosApi } from "../axiosApi"

export const postProfilesUsernameFollow = (username: string) => {
   return (
      axiosApi.post(`profiles/${username}/follow`)
   )
}
