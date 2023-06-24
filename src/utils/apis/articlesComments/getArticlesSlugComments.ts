import { axiosApi } from "../.."

export const getArticlesSlugComments = (slug: string) => {
   return (
      axiosApi.get(`articles/${slug}/comments`)
   )
}
