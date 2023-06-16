import axios, { CreateAxiosDefaults } from "axios"

const config: CreateAxiosDefaults = {
   baseURL: "https://api.realworld.io/api/",
   timeout: 10000
}

export const axiosApi = axios.create(config)

axiosApi.interceptors.request.use(
   (config) => {
      const token = localStorage.getItem('userToken')
      config.headers["Authorization"] = token ? `Bearer ${token}` : undefined
      return config
   },
   // (error) => {
   //    // return Promise.reject(error)
   // }
)
