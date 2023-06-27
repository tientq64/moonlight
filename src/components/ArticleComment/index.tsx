import classNames from "classnames"
import dayjs from "dayjs"
import { useState } from "react"
import { Button, Card } from "react-bootstrap"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"
import { useDeleteArticleComment } from "../../apis"
import { useUser } from "../../hooks"
import { ArticleCommentProps } from "./types"

export const ArticleComment = ({
   article,
   comment,
   onDeleted
}: ArticleCommentProps) => {
   const [user] = useUser()
   const [isDeleting, setIsDeleting] = useState<boolean>(false)

   const deleteArticleComment = useDeleteArticleComment()

   const handleClickDeleteComment = () => {
      setIsDeleting(true)
      deleteArticleComment(article.slug, comment.id)
         .then((response) => {
            onDeleted(comment.id)
         })
         .catch((reason) => {
            toast(reason.reponse.data, { type: "error" })
         })
         .finally(() => {
            setIsDeleting(false)
         })
   }

   return (
      <Card
         key={comment.id}
         className={classNames(
            "mt-4",
            isDeleting && "opacity-50"
         )}
      >
         <Card.Header>
            <div className="row justify-content-between">
               <div className="col-auto">
                  <div className="row">
                     <div className="col">
                        <Link to={`/profile/${comment.author.username}`}>
                           <img
                              className="rounded"
                              src={comment.author.image}
                              width={32}
                              alt="Avatar"
                           />
                        </Link>
                     </div>

                     <div className="col text-nowrap lh-1">
                        <Link
                           className="d-block text-decoration-none"
                           to={`/profile/${comment.author.username}`}
                        > {comment.author.username}
                        </Link>
                        <small className="text-muted">
                           {dayjs(comment.updatedAt).format("MMMM D, YYYY, HH:mm")}
                        </small>
                     </div>
                  </div>
               </div>

               <div className="col-auto">
                  {comment.author.username === user?.username && (
                     <Button
                        className="text-danger text-decoration-none"
                        size="sm"
                        variant="link"
                        disabled={isDeleting}
                        onClick={handleClickDeleteComment}
                     >
                        {isDeleting ? "Deleting" : "Delete"}
                     </Button>
                  )}
               </div>
            </div>
         </Card.Header>

         <Card.Body>
            {comment.body}
         </Card.Body>
      </Card>
   )
}
