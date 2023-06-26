import dayjs from "dayjs"
import { FormikProvider, useFormik } from "formik"
import { KeyboardEvent, useEffect, useMemo, useState } from "react"
import { Button, Col, Container, Form, FormControl, Row, Spinner } from "react-bootstrap"
import { Link, useParams } from "react-router-dom"
import {
   getArticlesSlug,
   getArticlesSlugComments,
   postArticlesSlugComments
} from "../../apis"
import { ArticleComment, Markdown } from "../../components"
import { useUser } from "../../hooks"
import { IArticle, IArticleComment } from "../../types"
import { truncateString } from "../../utils"
import { commentSchema } from "./commentSchema"

type Params = {
   slug?: string
}

interface CommentValues {
   body: string
}

export function ArticlePage() {
   const [user] = useUser()
   const { slug } = useParams<Params>()

   const [article, setArticle] = useState<IArticle | null>(null)
   const [comments, setComments] = useState<IArticleComment[]>([])
   const [isLoadingComments, setIsLoadingComments] = useState<boolean>(false)

   const isMyArticle: boolean = useMemo(() => {
      return Boolean(user && article && user.username === article.author.username)
   }, [user, article])

   const commentFormik = useFormik<CommentValues>({
      initialValues: {
         body: ""
      },

      validationSchema: commentSchema,
      validateOnMount: true,

      onSubmit(values, actions) {
         if (!slug) return

         postArticlesSlugComments(slug, {
            comment: {
               body: values.body.trim()
            }
         })
            .then((response) => {
               const newComments: IArticleComment[] = [response.data.comment, ...comments]
               setComments(newComments)
               actions.resetForm()
            })
            .finally(() => {
               actions.setSubmitting(false)
            })
      }
   })

   const handleKeyDownCommentBody = (event: KeyboardEvent): void => {
      if (event.repeat) return

      if (event.shiftKey && event.key === "Enter") {
         commentFormik.submitForm()
      }
   }

   const handleDeletedComment = (commentId: number): void => {
      setComments((prevComments) => {
         const newComments: IArticleComment[] = prevComments.filter((comment2: IArticleComment) => {
            return comment2.id !== commentId
         })
         return newComments
      })
   }

   useEffect(() => {
      if (!slug) return

      getArticlesSlug(slug)
         .then((response) => {
            setArticle(response.data.article)
         })

      setIsLoadingComments(true)
      getArticlesSlugComments(slug)
         .then((response) => {
            setComments(response.data.comments.toReversed())
         })
         .finally(() => {
            setIsLoadingComments(false)
         })
   }, [])

   return (
      <div>
         {article && (
            <>
               <div className="py-4 bg-dark text-white">
                  <Container>
                     <h1 className="text-break">
                        {truncateString(article.title, 120)}
                     </h1>

                     <Row className="justify-content-between mt-4">
                        <Col xs="auto">
                           <Row>
                              <Col>
                                 <Link to={`/profile/${article.author.username}`}>
                                    <img
                                       className="rounded"
                                       src={article.author.image}
                                       width={32}
                                       alt="Avatar"
                                    />
                                 </Link>
                              </Col>

                              <Col className="text-nowrap lh-1">
                                 <Link
                                    className="d-block text-decoration-none text-white"
                                    to={`/profile/${article.author.username}`}
                                 > {article.author.username}
                                 </Link>
                                 <small className="text-white-50">
                                    {dayjs(article.updatedAt).format("MMMM D, YYYY")}
                                 </small>
                              </Col>
                           </Row>
                        </Col>

                        <Col xs="auto">
                           <div className="d-flex gap-3">
                              {!isMyArticle && (
                                 <>
                                    <Button variant={article.favorited ? "primary" : "outline-primary"}>
                                       <i className="fas fa-heart me-2" />
                                       {article.favorited ? "Unfavorite" : "Favorite"} article
                                    </Button>
                                 </>
                              )}

                              {isMyArticle && (
                                 <>
                                    <Link className="btn btn-light" to={`/editor/${article.slug}`}>
                                       <i className="fas fa-edit me-2" />
                                       Edit article
                                    </Link>

                                    <Button variant="danger">
                                       <i className="fas fa-trash me-2" />
                                       Delete article
                                    </Button>
                                 </>
                              )}
                           </div>
                        </Col>
                     </Row>
                  </Container>
               </div>

               <Container>
                  <div className="py-4">
                     <Markdown content={article.body} />

                     <div className="border-top mt-4" />

                     {!user && (
                        <div className="mt-4 text-center text-muted">
                           <Link className="me-2 text-decoration-none" to="/login">Sign in</Link>
                           to comment...
                        </div>
                     )}

                     {user && (
                        <FormikProvider value={commentFormik}>
                           <Form onSubmit={commentFormik.handleSubmit}>
                              <div className="mt-4">
                                 <FormControl
                                    {...commentFormik.getFieldProps("body")}
                                    as="textarea"
                                    rows={4}
                                    disabled={commentFormik.isSubmitting}
                                    placeholder="Write a comment..."
                                    onKeyDown={handleKeyDownCommentBody}
                                 />
                              </div>

                              <div className="mt-3 text-end">
                                 <Button
                                    type="submit"
                                    disabled={commentFormik.isSubmitting || !commentFormik.isValid}
                                 > Post comment
                                 </Button>
                              </div>
                           </Form>
                        </FormikProvider>
                     )}

                     {comments.map((comment) => (
                        <ArticleComment
                           key={comment.id}
                           article={article}
                           comment={comment}
                           onDeleted={handleDeletedComment}
                        />
                     ))}
                  </div>
               </Container>
            </>
         )}

         {!article && (
            <div className="text-center mt-5">
               <Spinner />
            </div>
         )}
      </div>
   )
}
