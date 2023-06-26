import { IArticle } from "../../types"

export interface ArticleProps {
   article: IArticle
   onClickTag?: (articleTag: string) => void
}
