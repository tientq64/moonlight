import { IArticle, IArticleComment } from "../../types"

export interface ArticleCommentProps {
   article: IArticle
   comment: IArticleComment
   onDeleted: (commentId: number) => void
}
