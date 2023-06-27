import dayjs from "dayjs"
import { FormikProvider, useFormik } from "formik"
import { KeyboardEvent, useEffect, useMemo, useState } from "react"
import { Button, Col, Container, Form, FormControl, Row, Spinner } from "react-bootstrap"
import { Link, useNavigate, useParams } from "react-router-dom"
import { ArticleComment, Markdown } from "../../components"
import { useUser } from "../../hooks"
import { truncateString } from "../../utils"
import { commentSchema } from "./commentSchema"
import { IArticle, IComment, NewComment, useCreateArticleComment, useCreateArticleFavorite, useDeleteArticle, useDeleteArticleFavorite, useGetArticle, useGetArticleComments } from "../../apis"
import { toast } from "react-toastify"

type Params = {
   slug?: string
}

export function ArticlePage() {
   const [user] = useUser()
   const { slug } = useParams<Params>()
   const navigate = useNavigate()

   const [article, setArticle] = useState<IArticle | null>(null)
   const [isDeletingArticle, setIsDeletingArticle] = useState<boolean>(false)
   const [favorited, setFavorited] = useState<boolean>(false)
   const [isFavoriting, setIsFavoriting] = useState<boolean>(false)

   const [comments, setComments] = useState<IComment[]>([])
   const [isLoadingComments, setIsLoadingComments] = useState<boolean>(false)

   const createArticleComment = useCreateArticleComment()
   const getArticle = useGetArticle()
   const getArticleComments = useGetArticleComments()
   const deleteArticle = useDeleteArticle()

   const createArticleFavorite = useCreateArticleFavorite()
   const deleteArticleFavorite = useDeleteArticleFavorite()

   const isMyArticle: boolean = useMemo(() => {
      return Boolean(user && article && user.username === article.author.username)
   }, [user, article])

   const commentFormik = useFormik<NewComment>({
      initialValues: {
         body: ""
      },

      validationSchema: commentSchema,
      validateOnMount: true,

      onSubmit(values, actions) {
         if (!slug) return

         createArticleComment(slug, {
            comment: {
               body: values.body.trim()
            }
         })
            .then((response) => {
               const newComments: IComment[] = [response.data.comment, ...comments]
               setComments(newComments)
               actions.resetForm()
            })
            .finally(() => {
               actions.setSubmitting(false)
            })
      }
   })

   const handleClickFavoriteArticle = (): void => {
      if (!user) {
         navigate("/login")
         return
      }
      if (!article) return

      const api = favorited ? deleteArticleFavorite : createArticleFavorite
      const prevFavorited = favorited

      setFavorited(!favorited)
      setIsFavoriting(true)

      api(article.slug)
         .then((response) => {
            setFavorited(response.data.article.favorited)
         })
         .catch((reason) => {
            setFavorited(prevFavorited)
            toast(reason.response.data, { type: "error" })
         })
         .finally(() => {
            setIsFavoriting(false)
         })
   }

   const handleClickDeleteArticle = (): void => {
      if (!slug) return

      if (window.confirm("Do you want to delete this article?")) {
         setIsDeletingArticle(true)

         deleteArticle(slug)
            .then((response) => {
               toast("Article deleted!", { type: "success" })
               navigate(-1)
            })
            .catch((reason) => {
               toast(reason.reponse.data, { type: "error" })
            })
            .finally(() => {
               setIsDeletingArticle(false)
            })
      }
   }

   const handleKeyDownCommentBody = (event: KeyboardEvent): void => {
      if (event.repeat) return

      if (event.shiftKey && event.key === "Enter") {
         commentFormik.submitForm()
      }
   }

   const handleDeletedComment = (commentId: number): void => {
      setComments((prevComments) => {
         const newComments: IComment[] = prevComments.filter((comment2: IComment) => {
            return comment2.id !== commentId
         })
         return newComments
      })
      toast("Comment deleted!", { type: "success" })
   }

   useEffect(() => {
      if (!slug) return

      setIsLoadingComments(true)

      getArticle(slug)
         .then((response) => {
            setArticle(response.data.article)
         })

      getArticleComments(slug)
         .then((response) => {
            setComments(response.data.comments.reverse())
         })
         .finally(() => {
            setIsLoadingComments(false)
         })
   }, [])

   useEffect(() => {
      if (!article) return

      setFavorited(article.favorited)
   }, [article])

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
                                    <Button
                                       variant={favorited ? "primary" : "outline-primary"}
                                       disabled={isFavoriting}
                                       onClick={handleClickFavoriteArticle}
                                    >
                                       {isFavoriting && (
                                          <>
                                             <Spinner className="me-2" size="sm" />
                                             {favorited ? "Favoriting" : "Unfavoriting"}
                                          </>
                                       )}
                                       {!isFavoriting && (
                                          <>
                                             <i className="fas fa-heart me-2" />
                                             {favorited ? "Unfavorite" : "Favorite"} article
                                          </>
                                       )}
                                    </Button>
                                 </>
                              )}

                              {isMyArticle && (
                                 <>
                                    <Link
                                       className="btn btn-light"
                                       to={`/editor/${article.slug}`}
                                    >
                                       <i className="fas fa-edit me-2" />
                                       Edit article
                                    </Link>

                                    <Button
                                       variant="danger"
                                       disabled={isDeletingArticle}
                                       onClick={handleClickDeleteArticle}
                                    >
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
