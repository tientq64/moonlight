import { axiosApi } from "../.."
import { IArticleEdit } from "../../../types"

type Data = {
   article: IArticleEdit
}

export const postArticles = (data: Data) => {
   return (
      axiosApi.post("articles", data)
   )
}
