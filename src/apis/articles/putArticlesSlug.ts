import { IArticleEdit, IArticle } from "../../types"
import { axiosApi } from "../axiosApi"

type Data = {
   article: IArticleEdit | IArticle
}

export const putArticlesSlug = (slug: string, data: Data) => {
   return (
      axiosApi.put(`articles/${slug}`, data)
   )
}
