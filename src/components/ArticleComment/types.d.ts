import { IArticle, IComment } from "../../apis"

export interface ArticleCommentProps {
   article: IArticle
   comment: IComment
   onDeleted: (commentId: number) => void
}
