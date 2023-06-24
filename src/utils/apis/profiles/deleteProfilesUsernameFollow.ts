import { axiosApi } from "../.."

export const deleteProfilesUsernameFollow = (username: string) => {
   return (
      axiosApi.delete(`profiles/${username}/follow`)
   )
}
