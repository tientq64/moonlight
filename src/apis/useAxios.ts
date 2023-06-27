import axios, { CreateAxiosDefaults, AxiosInstance } from "axios"
import { useUser } from "../hooks"

const config: CreateAxiosDefaults = {
   baseURL: "https://api.realworld.io/api/",
   timeout: 10000
}

export const useAxios = (): AxiosInstance => {
   const [user] = useUser()
   const axiosApi: AxiosInstance = axios.create(config)

   axiosApi.interceptors.request.use(
      (config) => {
         const token: string | undefined = user ? user.token : undefined
         if (token) {
            config.headers["Authorization"] = `Bearer ${token}`
         }
         return config
      },
      // (error) => {
      //    // return Promise.reject(error)
      // }
   )
   return axiosApi
}
