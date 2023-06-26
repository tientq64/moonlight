import { axiosApi } from "../axiosApi"

type RequireAtLeastOne<T> = {
   [K in keyof T]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<keyof T, K>>>
}[keyof T]

type Data = RequireAtLeastOne<{
   user: {
      email: string
      username: string
      bio: string
      image: string
      password?: string
   }
}>

export const putUser = (data: Data) => {
   return (
      axiosApi.put("user", data)
   )
}
