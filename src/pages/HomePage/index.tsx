import { useEffect, useState } from "react"
import { Button, Col, Collapse, Container, Dropdown, Nav, Row, Spinner, Tab } from "react-bootstrap"
import { IArticle, MultipleArticlesResponse, useGetArticles, useGetArticlesFeed, useGetTags } from "../../apis"
import logo from "../../assets/images/logo.png"
import { Article, EmptyState, Pagination2 } from "../../components"
import { useUser } from "../../hooks"
import styles from "./styles.module.scss"
import classNames from "classnames"

export function HomePage() {
   const [user] = useUser()

   const [tags, setTags] = useState<string[]>([])
   const [activedTab, setActivedTab] = useState<string>("globalFeed")

   const [isCollapseInTags, setIsCollapseInTags] = useState<boolean>(true)

   const [isLoadingArticles, setIsLoadingArticles] = useState<boolean>(false)
   const [articles, setArticles] = useState<IArticle[]>([])
   const [articlesCount, setArticlesCount] = useState<number>(0)

   const [pageSize, setPageSize] = useState<number>(10)
   const [page, setPage] = useState<number>(0)

   const [isLoadingTags, setIsLoadingTags] = useState<boolean>(false)

   const getArticles = useGetArticles()
   const getArticlesFeed = useGetArticlesFeed()
   const getTags = useGetTags()

   const handleClickArticleTag = (tag: string): void => {
      setActivedTab(`#${tag}`)
   }

   useEffect(() => {
      setIsLoadingTags(true)

      getTags()
         .then((response) => {
            setTags(response.data.tags)
         })
         .finally(() => {
            setIsLoadingTags(false)
         })
   }, [])

   useEffect(() => {
      if (activedTab[0] === "#") {
         setIsCollapseInTags(true)
      }
   }, [activedTab])

   useEffect(() => {
      setPage(0)
   }, [activedTab, pageSize])

   useEffect(() => {
      setIsLoadingArticles(true)
      setArticles([])
      setArticlesCount(0)

      const api = activedTab === "yourFeed" ? getArticlesFeed : getArticles
      const tag = activedTab[0] === "#" ? activedTab?.substring(1) : undefined

      api({
         limit: pageSize,
         offset: page * pageSize,
         tag
      })
         .then((response) => {
            const data: MultipleArticlesResponse = response.data
            setArticles(data.articles)
            setArticlesCount(data.articlesCount)
         })
         .finally(() => {
            setIsLoadingArticles(false)
         })
   }, [activedTab, pageSize, page, user])

   return (
      <div>
         <div className="py-5 text-center text-bg-dark">
            <h1 className="fs-1 fw-bold">
               Mo
               <img className={styles.bannerLogo} src={logo} alt="Logo" />
               nlight
            </h1>
            <div className="lead">
               A place to share your life (at the end of) every day.
            </div>
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
                        {user && (
                           <>
                              <Nav.Item>
                                 <Nav.Link eventKey="yourFeed">
                                    <i className="fas fa-user me-2" />
                                    Your feed
                                 </Nav.Link>
                              </Nav.Item>
                           </>
                        )}

                        <Nav.Item>
                           <Nav.Link eventKey="globalFeed">
                              <i className="far fa-globe me-2" />
                              Global feed
                           </Nav.Link>
                        </Nav.Item>

                        <div className="border-top my-1" />

                        <Nav.Item
                           aria-controls="collapseTags"
                           onClick={() => setIsCollapseInTags(!isCollapseInTags)}
                        >
                           <Nav.Link>
                              <i className="far fa-hashtag me-2" />
                              Popular tags
                           </Nav.Link>
                        </Nav.Item>
                        <Collapse
                           className="mt-1"
                           in={isCollapseInTags}
                        >
                           <div id="collapseTags">
                              {tags.map((tag, index) => (
                                 <Nav.Item key={index}>
                                    <Nav.Link eventKey={"#" + tag}>
                                       {tag}
                                    </Nav.Link>
                                 </Nav.Item>
                              ))}
                           </div>
                        </Collapse>
                     </Nav>
                  </Col>

                  <Col md={8} xl={9} className="mt-4 mt-md-0">
                     <Tab.Content>
                        {isLoadingArticles && (
                           <div className="text-center mt-4">
                              <Spinner />
                           </div>
                        )}

                        {!isLoadingArticles && articles.map((article, index) => (
                           <Article
                              key={index}
                              article={article}
                              onClickTag={handleClickArticleTag}
                           />
                        ))}

                        {!isLoadingArticles && articles.length === 0 && (
                           <EmptyState
                              icon="search"
                              header="No articles found"
                           />
                        )}

                        {!isLoadingArticles && articles.length > 0 && (
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
