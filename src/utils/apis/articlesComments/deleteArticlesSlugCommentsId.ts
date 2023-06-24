import { axiosApi } from "../.."

export const deleteArticlesSlugCommentsId = (slug: string, id: number) => {
   return (
      axiosApi.delete(`articles/${slug}/comments/${id}`)
   )
}
