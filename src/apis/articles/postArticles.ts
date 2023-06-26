import { IArticleEdit } from "../../types"
import { axiosApi } from "../axiosApi"

type Data = {
   article: IArticleEdit
}

export const postArticles = (data: Data) => {
   return (
      axiosApi.post("articles", data)
   )
}
