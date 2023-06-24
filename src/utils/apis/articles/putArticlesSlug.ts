import { axiosApi } from "../.."
import { IArticle, IArticleEdit } from "../../../types"

type Data = {
   article: IArticleEdit | IArticle
}

export const putArticlesSlug = (slug: string, data: Data) => {
   return (
      axiosApi.put(`articles/${slug}`, data)
   )
}
