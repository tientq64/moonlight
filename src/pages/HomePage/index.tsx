import { useEffect, useState } from "react"
import { Col, Container, Nav, Row, Tab } from "react-bootstrap"
import { useSelector } from "react-redux"
import { Article, Pagination2 } from "../../components"
import { RootState } from "../../store"
import { IArticle } from "../../types"
import { getArticles, getTags } from "../../utils"

export function HomePage() {
   const user = useSelector((state: RootState) => state.user.user)

   const [tags, setTags] = useState<string[]>([])
   const [activedTab, setActivedTab] = useState<string>("globalFeed")

   const [isLoadingArticles, setIsLoadingArticles] = useState<boolean>(false)
   const [articles, setArticles] = useState<IArticle[]>([])
   const [articlesCount, setArticlesCount] = useState<number>(0)
   const [pageSize, setPageSize] = useState<number>(10)
   const [page, setPage] = useState<number>(0)

   useEffect(() => {
      getTags()
         .then((response) => {
            setTags(response.data.tags)
         })
   }, [])

   useEffect(() => {
      setPage(0)
   }, [activedTab, pageSize])

   useEffect(() => {
      setIsLoadingArticles(true)
      setArticles([])
      setArticlesCount(0)
      const tag = activedTab[0] === "#" ? activedTab?.substring(1) : undefined
      getArticles({ limit: pageSize, offset: page * pageSize, tag })
         .then((response) => {
            setArticles(response.data.articles)
            setArticlesCount(response.data.articlesCount)
         })
         .finally(() => {
            setIsLoadingArticles(false)
         })
   }, [activedTab, pageSize, page, user])

   return (
      <div>
         <div className="py-5 text-center text-bg-dark">
            <h1 className="fs-1 fw-bold">
               Mo🌖nlight
               {/* 🌕 or 🌖 */}
            </h1>
            <div className="lead">A place to share your life (at the end of) every day.</div>
         </div>

         <Container className="my-5">
            <Tab.Container
               activeKey={activedTab}
               onSelect={(activeKey: any) => setActivedTab(activeKey)}
            >
               <Row>
                  <Col md={4} xl={3}>
                     <Nav
                        className="flex-column sticky-top bg-primary bg-opacity-15 p-3 rounded"
                        variant="pills"
                        style={{ top: 96 }}
                     >
                        <Nav.Item>
                           <Nav.Link eventKey="globalFeed">
                              <i className="fas fa-globe me-2" />
                              Global feed
                           </Nav.Link>
                        </Nav.Item>
                        {tags.map((tag, index) => (
                           <Nav.Item key={index}>
                              <Nav.Link eventKey={"#" + tag}>
                                 <i className="fas fa-hashtag me-2" />
                                 {tag}
                              </Nav.Link>
                           </Nav.Item>
                        ))}
                     </Nav>
                  </Col>

                  <Col md={8} xl={9} className="mt-4 mt-md-0">
                     <Tab.Content>
                        {isLoadingArticles && (
                           <div className="text-center mt-4">
                              <i className="fas fa-spinner fa-spin fs-2" />
                           </div>
                        )}

                        {articles.map((article, index) => (
                           <Article key={index} article={article} />
                        ))}

                        {!isLoadingArticles && (
                           <Pagination2
                              className="mt-5"
                              current={page}
                              total={articlesCount}
                              onChange={(page) => setPage(page)}
                           />
                        )}
                     </Tab.Content>
                  </Col>
               </Row>
            </Tab.Container>
         </Container>
      </div>
   )
}
