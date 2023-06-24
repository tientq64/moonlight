import dayjs from "dayjs"
import { FormikProvider, useFormik } from "formik"
import { useEffect, useMemo, useState } from "react"
import { Button, Card, Col, Container, Form, FormControl, ListGroup, Row } from "react-bootstrap"
import { Link, useParams } from "react-router-dom"
import { IArticle, IArticleComment } from "../../types"
import { deleteArticlesSlugCommentsId, getArticlesSlug, getArticlesSlugComments, markdownToHtml, postArticlesSlugComments, truncateString, useUser } from "../../utils"
import { commentSchema } from "./commentSchema"
import { FormControlError, Markdown } from "../../components"
import classNames from "classnames"

type Params = {
   slug?: string
}

type CommentValues = {
   body: string
}

export function ArticlePage() {
   const [user] = useUser()
   const { slug } = useParams<Params>()

   const [article, setArticle] = useState<IArticle | null>(null)
   const [comments, setComments] = useState<IArticleComment[]>([])
   const [isLoadingComments, setIsLoadingComments] = useState<boolean>(false)
   const [isDeletingComment, setIsDeletingComment] = useState<boolean>(false)

   const isMyArticle: boolean = useMemo(() => {
      return Boolean(user && article && user.username === article.author.username)
   }, [user, article])

   const commentFormik = useFormik<CommentValues>({
      initialValues: {
         body: ""
      },

      validationSchema: commentSchema,

      onSubmit(values, actions) {
         if (!slug) return

         postArticlesSlugComments(slug, {
            comment: {
               body: values.body
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

   const handleClickDeleteComment = (comment: IArticleComment): void => {
      if (!slug) return

      setIsDeletingComment(true)

      deleteArticlesSlugCommentsId(slug, comment.id)
         .then((response) => {
            const newComments = comments.filter((comment2: IArticleComment) => {
               return comment2.id !== comment.id
            })
            setComments(newComments)
         })
         .finally(() => {
            setIsDeletingComment(false)
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
                     <h1 className="word-break">
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
                        <Card
                           key={comment.id}
                           className="mt-4"
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
                                    <Button
                                       className="text-danger text-decoration-none"
                                       size="sm"
                                       variant="link"
                                       // disabled={false}
                                       onClick={handleClickDeleteComment.bind(null, comment)}
                                    > Delete
                                    </Button>
                                 </div>
                              </div>
                           </Card.Header>

                           <Card.Body>
                              {comment.body}
                           </Card.Body>
                        </Card>
                     ))}
                  </div>
               </Container>
            </>
         )}

         {!article && (
            <div className="text-center mt-5">
               <i className="fas fa-spinner fa-spin fs-2" />
            </div>
         )}
      </div>
   )
}
