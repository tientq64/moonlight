import { axiosApi } from "../axiosApi"

export const deleteProfilesUsernameFollow = (username: string) => {
   return (
      axiosApi.delete(`profiles/${username}/follow`)
   )
}
