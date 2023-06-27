import { IArticle } from "../../apis"

export interface ArticleProps {
   article: IArticle
   onClickTag?: (articleTag: string) => void
}
