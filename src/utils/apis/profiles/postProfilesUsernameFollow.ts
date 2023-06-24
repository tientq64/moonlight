import { axiosApi } from "../.."

export const postProfilesUsernameFollow = (username: string) => {
   return (
      axiosApi.post(`profiles/${username}/follow`)
   )
}
