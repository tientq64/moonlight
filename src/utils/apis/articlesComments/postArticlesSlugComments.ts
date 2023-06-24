import { axiosApi } from "../.."

type Data = {
   comment: {
      body: string
   }
}

export const postArticlesSlugComments = (slug: string, data: Data) => {
   return (
      axiosApi.post(`articles/${slug}/comments`, data)
   )
}
