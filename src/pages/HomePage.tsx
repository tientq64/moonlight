import { MouseEvent, useEffect, useMemo, useState } from "react"
import { Button, Col, Container, ListGroup, Nav, Pagination, Row, Tab, Tabs } from "react-bootstrap"

import { Article } from "../components"
import { RootState } from "../store"
import { IArticle, IUser } from "../types"
import { getArticles, getTags } from "../utils"
import { useSelector } from "react-redux"

export function HomePage() {
   const user = useSelector((state: RootState) => state.user.user)

   const [tags, setTags] = useState<string[]>([])
   const [activedTab, setActivedTab] = useState<string>("globalFeed")

   const [loadingArticles, setLoadingArticles] = useState<boolean>(false)
   const [articles, setArticles] = useState<IArticle[]>([])
   const [articlesCount, setArticlesCount] = useState<number>(0)
   const [limit, setLimit] = useState<number>(10)
   const [pageIndex, setPageIndex] = useState<number>(0)

   const maxPageIndex = useMemo(() => {
      return Math.ceil(articlesCount / limit)
   }, [articlesCount, limit])

   const pageIndexes = useMemo(() => {
      return [...Array(maxPageIndex).keys()]
   }, [maxPageIndex])

   useEffect(() => {
      getTags()
         .then((response) => {
            setTags(response.data.tags)
         })
   }, [])

   useEffect(() => {
      setPageIndex(0)
   }, [activedTab, limit])

   useEffect(() => {
      setLoadingArticles(true)
      setArticles([])
      const tag = activedTab[0] === "#" ? activedTab?.substring(1) : undefined
      getArticles({ limit, offset: pageIndex * limit, tag })
         .then((response) => {
            setArticles(response.data.articles)
            setArticlesCount(response.data.articlesCount)
         })
         .finally(() => {
            setLoadingArticles(false)
         })
   }, [activedTab, limit, pageIndex, user])

   return (
      <div>
         <div className="py-5 text-center text-bg-dark">
            <h1 className="fs-1 fw-bold">
               C<i className="fas fa-globe fs-4 align-middle" />nduit
            </h1>
            <div className="lead">A place to share your knowledge.</div>
         </div>

         <Container className="mt-5">
            <Tab.Container
               activeKey={activedTab}
               onSelect={(activeKey: any) => setActivedTab(activeKey)}
            >
               <Row>
                  <Col sm={3}>
                     <Nav className="flex-column sticky-top p-3 border rounded" variant="pills" style={{ top: 96 }}>
                        <Nav.Item>
                           <Nav.Link eventKey="globalFeed">
                              <i className="fas fa-globe me-2" />
                              Global Feed
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

                  <Col sm={9}>
                     <Tab.Content>
                        {loadingArticles && (
                           <div className="text-center mt-4">
                              <i className="fas fa-spinner fa-spin fs-2" />
                           </div>
                        )}

                        <ListGroup>
                           {articles.map((article, index) => (
                              <ListGroup.Item key={index}>
                                 <Article article={article} />
                              </ListGroup.Item>
                           ))}
                        </ListGroup>

                        {!loadingArticles && (
                           <Pagination className="flex-wrap justify-content-center mt-4">
                              <Pagination.First />
                              <Pagination.Prev />

                              {pageIndexes.map((pageIndex2) => (
                                 <Pagination.Item
                                    key={pageIndex2}
                                    active={pageIndex2 === pageIndex}
                                    onClick={() => setPageIndex(pageIndex2)}
                                 > {pageIndex2 + 1}
                                 </Pagination.Item>
                              ))}

                              <Pagination.Next />
                              <Pagination.Last />
                           </Pagination>
                        )}
                     </Tab.Content>
                  </Col>
               </Row>
            </Tab.Container>
         </Container>
      </div>
   )
}
