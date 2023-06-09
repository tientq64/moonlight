import axios from "axios"

export const axiosApi = axios.create({
   baseURL: "https://api.realworld.io/api/",
   timeout: 10000
})
