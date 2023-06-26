import { AxiosResponse } from "axios"
import classNames from "classnames"
import { FormikProvider, useFormik } from "formik"
import { useEffect, useRef, useState } from "react"
import { Button, Col, Container, Form, FormControl, FormGroup, Row, Spinner } from "react-bootstrap"
import { useNavigate, useParams } from "react-router-dom"
import { TagsInput } from "react-tag-input-component"
import { CodeMirrorEditor, FormControlError, Markdown } from "../../components"
import { IArticle, IArticleEdit } from "../../types"
import { getArticlesSlug, postArticles, putArticlesSlug, useUser } from "../../utils"
import { validationSchema } from "./validationSchema"
import styles from "./styles.module.scss"

type Params = {
   slug?: string
}

type ArticleValues = IArticleEdit | IArticle

export function EditorPage() {
   const { slug } = useParams<Params>()
   const [user] = useUser()
   const navigate = useNavigate()

   if (!user) {
      navigate("/login")
   }

   const [article, setArticle] = useState<ArticleValues | null>(null)
   const [isLoadingArticle, setIsLoadingArticle] = useState<boolean>(false)
   const [isPreviewBody, setIsPreviewBody] = useState<boolean>(true)

   const handleClickTogglePreviewBody = () => {
      setIsPreviewBody(!isPreviewBody)
   }

   const formik = useFormik<ArticleValues>({
      initialValues: {
         title: "",
         description: "",
         body: "",
         tagList: []
      },

      validationSchema: validationSchema,

      onSubmit(values, actions) {
         const funcApiPromise: Promise<AxiosResponse> = slug
            ? putArticlesSlug(slug, { article: values })
            : postArticles({ article: values })
         funcApiPromise
            .then((response: AxiosResponse) => {
               navigate(`/article/${response.data.article.slug}`)
            })
            .catch(() => {
               actions.setSubmitting(false)
            })
      }
   })

   const handleChangeCodeMirrorEditorBody = (value: string): void => {
      formik.setFieldValue("body", value)
   }

   const handleChangeTagList = (tagList: string[]): void => {
      formik.setFieldValue("tagList", tagList)
   }

   useEffect(() => {
      if (slug) {
         setIsLoadingArticle(true)
         getArticlesSlug(slug)
            .then((response) => {
               const article2: IArticle = response.data.article
               setArticle(article2)
               formik.setValues(article2)
            })
            .finally(() => {
               setIsLoadingArticle(false)
            })
      } else {
         const newArticle: IArticleEdit = {
            title: "",
            description: "",
            body: "",
            tagList: []
         }
         setArticle(newArticle)
      }
   }, [])

   return (
      <Container className="py-4">
         {article && (
            <FormikProvider value={formik}>
               <Form onSubmit={formik.handleSubmit}>
                  <FormGroup className="mt-3">
                     <div className="fw-semibold fs-4">Title</div>
                     <FormControl
                        {...formik.getFieldProps("title")}
                        className="fs-4"
                        disabled={formik.isSubmitting}
                        placeholder="Article title"
                     />
                     <FormControlError name="title" />
                  </FormGroup>

                  <FormGroup className="mt-3">
                     <div className="fw-semibold">Description</div>
                     <FormControl
                        {...formik.getFieldProps("description")}
                        disabled={formik.isSubmitting}
                        placeholder="What's this article about?"
                     />
                     <FormControlError name="description" />
                  </FormGroup>

                  <FormGroup className="mt-3">
                     <Row className="fw-semibold">
                        <Col>Body</Col>
                        <Col className="d-none d-lg-block">
                           <Button
                              className="float-end text-decoration-none py-0"
                              size="sm"
                              variant="link"
                              onClick={handleClickTogglePreviewBody}
                           > Toggle preview
                           </Button>
                        </Col>
                     </Row>

                     <Row className="flex-nowrap gap-4 g-0">
                        <Col>
                           <CodeMirrorEditor
                              disabled={formik.isSubmitting}
                              placeholder="Write your article (in Markdown)"
                              value={formik.values.body}
                              onChange={handleChangeCodeMirrorEditorBody}
                           />
                        </Col>

                        {isPreviewBody && (
                           <Col className="max-h-100vh d-none d-lg-block overflow-auto text-break">
                              <Markdown content={formik.values.body} />
                           </Col>
                        )}
                     </Row>
                     <FormControlError name="body" />
                  </FormGroup>

                  <FormGroup className="mt-3">
                     <div className="fw-semibold">Tag list</div>
                     <TagsInput
                        classNames={{ tag: "text-break" }}
                        name="tagList"
                        disabled={formik.isSubmitting}
                        placeHolder="Enter tags"
                        value={formik.values.tagList}
                        onChange={handleChangeTagList}
                     />
                     <FormControlError name="tagList" />
                  </FormGroup>

                  <FormGroup className="mt-3">
                     <div className="d-grid d-md-block text-center text-md-end">
                        <Button
                           type="submit"
                           size="lg"
                           disabled={formik.isSubmitting}
                        >
                           <i className="fas fa-circle-arrow-up me-2" />
                           Publish article
                        </Button>
                     </div>
                  </FormGroup>
               </Form>
            </FormikProvider>
         )}

         {!article && (
            <div className="mt-5 text-center">
               <Spinner />
            </div>
         )}
      </Container>
   )
}
