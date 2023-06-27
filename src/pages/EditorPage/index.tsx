import { AxiosResponse } from "axios"
import classNames from "classnames"
import CodeMirror from "codemirror"
import "codemirror/lib/codemirror.css"
import "codemirror/mode/markdown/markdown"
import { FormikProvider, useFormik } from "formik"
import { UIEvent, useEffect, useRef, useState } from "react"
import { Button, Col, Container, Form, FormControl, FormGroup, Row, Spinner } from "react-bootstrap"
import { Navigate, useNavigate, useParams } from "react-router-dom"
import { TagsInput } from "react-tag-input-component"
import { FormControlError, Markdown } from "../../components"
import { useUser } from "../../hooks"
import "./styles.scss"
import { validationSchema } from "./validationSchema"
import { IArticle, NewArticle, UpdateArticle, useCreateArticle, useGetArticle, useUpdateArticle } from "../../apis"

type Params = {
   slug?: string
}

type EditArticle = NewArticle | UpdateArticle

let cm: CodeMirror.EditorFromTextArea | null = null
let isCmScrolling: boolean = true

export function EditorPage() {
   const { slug } = useParams<Params>()
   const [user] = useUser()
   const navigate = useNavigate()

   const [article, setArticle] = useState<EditArticle | null>(null)
   const [isLoadingArticle, setIsLoadingArticle] = useState<boolean>(false)
   const [isPreviewBody, setIsPreviewBody] = useState<boolean>(true)
   const bodyTextAreaRef = useRef(null)
   const bodyPreviewRef = useRef(null)

   const getArticle = useGetArticle()
   const createArticle = useCreateArticle()
   const updateArticle = useUpdateArticle()

   const formik = useFormik<EditArticle>({
      initialValues: {
         title: "",
         description: "",
         body: "",
         tagList: []
      },

      validationSchema: validationSchema,

      onSubmit(values, actions) {
         cm?.setOption("readOnly", true)

         const apiPromise: Promise<AxiosResponse> = slug
            ? updateArticle(slug, {
               article: values
            })
            : createArticle({
               article: values
            })
         apiPromise
            .then((response: AxiosResponse) => {
               navigate(`/article/${response.data.article.slug}`)
            })
            .catch(() => {
               actions.setSubmitting(false)
            })
            .finally(() => {
               cm?.setOption("readOnly", false)
            })
      }
   })

   const handleClickTogglePreviewBody = (): void => {
      setIsPreviewBody(!isPreviewBody)
   }

   const handleScrollPreviewBody = (event: UIEvent<HTMLDivElement>): void => {
      if (!cm) return
      if (isCmScrolling) return

      const bodyPreviewEl: any = bodyPreviewRef.current
      if (!bodyPreviewEl) return

      const scrollInfo: CodeMirror.ScrollInfo = cm.getScrollInfo()

      const bodyPreviewScrollRatio: number = bodyPreviewEl.scrollTop / (bodyPreviewEl.scrollHeight - bodyPreviewEl.clientHeight)
      const cmScrollTop: number = Math.floor(
         bodyPreviewScrollRatio * (scrollInfo.height - scrollInfo.clientHeight)
      )
      cm.scrollTo(0, cmScrollTop)
   }

   const handleChangeTagList = (tagList: string[]): void => {
      formik.setFieldValue("tagList", tagList)
   }

   const handleScrollCodeMirrorBody = (cm: CodeMirror.Editor): void => {
      if (!isCmScrolling) return

      const bodyPreviewEl: any = bodyPreviewRef.current
      if (!bodyPreviewEl) return

      const scrollInfo: CodeMirror.ScrollInfo = cm.getScrollInfo()
      const cmScrollRatio: number = scrollInfo.top / (scrollInfo.height - scrollInfo.clientHeight)
      const bodyPreviewScrollTop: number = Math.floor(
         cmScrollRatio * (bodyPreviewEl.scrollHeight - bodyPreviewEl.clientHeight)
      )
      bodyPreviewEl.scrollTop = bodyPreviewScrollTop
   }

   const handleCursorActivityCodeMirrorBody = (cm: CodeMirror.Editor): void => {
      isCmScrolling = true
   }

   useEffect(() => {
      const textAreaEl = bodyTextAreaRef.current
      if (!textAreaEl) return

      cm = CodeMirror.fromTextArea(textAreaEl, {
         mode: "markdown",
         lineWrapping: true,
         lineNumbers: true,
         showCursorWhenSelecting: true
      })
      cm.setValue(formik.values.body)
      cm.clearHistory()
      cm.on("change", (cm: CodeMirror.Editor) => {
         formik.setFieldValue("body", cm.getValue())
      })
      cm.on("scroll", handleScrollCodeMirrorBody)
      cm.on("cursorActivity", handleCursorActivityCodeMirrorBody)

      return () => {
         if (!cm) return
         cm.toTextArea()
         cm = null
      }
   }, [article])

   useEffect(() => {
      if (!cm) return
      cm.refresh()
      if (isPreviewBody) {
         isCmScrolling = true
         handleScrollCodeMirrorBody(cm)
      }
   }, [isPreviewBody])

   useEffect(() => {
      if (slug) {
         setIsLoadingArticle(true)
         getArticle(slug)
            .then((response) => {
               const article2: IArticle = response.data.article
               if (article2.author.username === user?.username) {
                  setArticle(article2)
                  formik.setValues(article2)
               } else {
                  navigate("/editor", { replace: true })
               }
            })
            .finally(() => {
               setIsLoadingArticle(false)
            })
      } else {
         const newArticle: EditArticle = {
            title: "",
            description: "",
            body: "",
            tagList: []
         }
         setArticle(newArticle)
      }
   }, [slug])

   if (!user) {
      return <Navigate to="/login" replace />
   }

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
                        <Col>
                           <Button
                              className="float-end text-decoration-none py-0"
                              size="sm"
                              variant="link"
                              onClick={handleClickTogglePreviewBody}
                           > Toggle preview
                           </Button>
                        </Col>
                     </Row>

                     <Row className="g-0">
                        <Col
                           className={classNames(
                              isPreviewBody && "col-lg-6 pe-lg-3"
                           )}
                           onMouseDown={() => isCmScrolling = true}
                           onWheel={() => isCmScrolling = true}
                        >
                           <textarea ref={bodyTextAreaRef} />
                        </Col>

                        {isPreviewBody && (
                           <Col
                              ref={bodyPreviewRef}
                              className="col-6 ps-3 max-h-75vh d-none d-lg-block overflow-auto text-break"
                              onMouseDown={() => isCmScrolling = false}
                              onWheel={() => isCmScrolling = false}
                              onScroll={handleScrollPreviewBody}
                           >
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
                           {formik.isSubmitting && (
                              <>
                                 <Spinner />
                                 Publishing article
                              </>
                           )}
                           {!formik.isSubmitting && (
                              <>
                                 <i className="fas fa-circle-arrow-up me-2" />
                                 Publish article
                              </>
                           )}
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
