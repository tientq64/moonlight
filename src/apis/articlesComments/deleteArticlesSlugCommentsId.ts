import { axiosApi } from "../axiosApi"

export const deleteArticlesSlugCommentsId = (articleSlug: string, commentId: number) => {
   return (
      axiosApi.delete(`articles/${articleSlug}/comments/${commentId}`)
   )
}
