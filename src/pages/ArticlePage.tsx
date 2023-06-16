import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { Button, Col, Container, Row } from "react-bootstrap"

import { getArticlesSlug, mdToHtml } from "../utils"
import { IArticle } from "../types"

type Params = {
   slug?: string
}

export function ArticlePage() {
   const { slug } = useParams<Params>()
   const [article, setArticle] = useState<IArticle | null>()

   useEffect(() => {
      if (!slug) {
         return
      }
      getArticlesSlug(slug)
         .then((response) => {
            setArticle(response.data.article)
         })
   }, [])

   return (
      <div>
         {article && (
            <>
               <div className="py-4 bg-dark text-white">
                  <Container>
                     <h1 className="word-break">{article.title}</h1>

                     <Row className="mt-4">
                        <Col xs="auto">
                           <Row>
                              <Col>
                                 <Link to={`/profile/${article.author.username}`}>
                                    <img className="rounded" src={article.author.image} width={32} alt="Avatar" />
                                 </Link>
                              </Col>
                           </Row>
                        </Col>
                     </Row>
                  </Container>
               </div>

               <Container>
                  <div className="py-4">
                     <p className="word-break" dangerouslySetInnerHTML={{ __html: mdToHtml(article.body) }} />

                     <div className="border-top mt-4">
                        <div className="mt-4">
                           <textarea
                              className="form-control"
                              rows={4}
                              placeholder="Write a comment..."
                           />
                        </div>
                        <div className="mt-3 text-end">
                           <Button>Post comment</Button>
                        </div>
                     </div>
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
