import classNames from "classnames"
import { useEffect, useMemo, useState } from "react"
import { Button, Col, Container, Nav, Row, Spinner, Tab } from "react-bootstrap"
import { useSelector } from "react-redux"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Article, EmptyState, Pagination2 } from "../../components"
import { RootState } from "../../store"
import { IArticle, IProfile, IUser } from "../../types"
import {
   GetArticlesParams,
   deleteProfilesUsernameFollow,
   getArticles,
   getProfilesUsername,
   postProfilesUsernameFollow
} from "../../utils"

type Params = {
   username: string
}

enum Tabs {
   MyArticles = "myArticles",
   FavoritedArticles = "favoritedArticles"
}

export function ProfilePage() {
   const user = useSelector((state: RootState) => state.user.user)

   const navigate = useNavigate()
   const { username } = useParams<Params>()

   const [profile, setProfile] = useState<IProfile | IUser | null>()
   const [profileFollowing, setProfileFollowing] = useState<boolean>(false)
   const [isFollowing, setIsFollowing] = useState<boolean>(false)

   const [activedTab, setActivedTab] = useState<Tabs>(Tabs.MyArticles)

   const [articles, setArticles] = useState<IArticle[]>([])
   const [articlesCount, setArticlesCount] = useState<number>(0)
   const [loadingArticles, setLoadingArticles] = useState<boolean>(false)
   const [pageSize, setPageSize] = useState<number>(10)
   const [page, setPage] = useState<number>(0)

   const isMe: boolean = useMemo(() => {
      return user?.username === username
   }, [username, user])

   const handleClickFollowProfile = () => {
      if (!profile) return

      if (!user) {
         navigate("/login")
         return
      }
      const username: string = profile.username
      const prevFrofileFollowing: boolean = profileFollowing
      const funcApi = profileFollowing
         ? deleteProfilesUsernameFollow
         : postProfilesUsernameFollow

      setIsFollowing(true)
      setProfileFollowing(!prevFrofileFollowing)

      funcApi(username)
         .then((response) => {
            const profile3: IProfile = response.data.profile
            setProfileFollowing(profile3.following)
         })
         .catch(() => {
            setProfileFollowing(prevFrofileFollowing)
         })
         .finally(() => {
            setIsFollowing(false)
         })
   }

   useEffect(() => {
      if (!username) {
         return
      }
      setProfile(null)
      setActivedTab(Tabs.MyArticles)
      if (isMe) {
         setProfile(user)
      } else {
         getProfilesUsername(username)
            .then((response) => {
               const profile2: IProfile = response.data.profile
               setProfile(profile2)
               setProfileFollowing(profile2.following)
            })
      }
   }, [username, user])

   useEffect(() => {
      setPage(0)
   }, [activedTab, pageSize, username])

   useEffect(() => {
      if (!profile) return

      setLoadingArticles(true)
      setArticles([])
      setArticlesCount(0)

      const params: GetArticlesParams = {
         limit: pageSize,
         offset: page * pageSize
      }
      if (activedTab === Tabs.MyArticles) {
         params.author = profile.username
      } else if (activedTab === Tabs.FavoritedArticles) {
         params.favorited = profile.username
      }

      getArticles(params)
         .then((response) => {
            setArticles(response.data.articles)
            setArticlesCount(response.data.articlesCount)
         })
         .finally(() => {
            setLoadingArticles(false)
         })
   }, [activedTab, pageSize, page, profile])

   return (
      <div>
         {profile && (
            <>
               <div className="py-5 text-bg-dark">
                  <Container>
                     <Row className="align-items-end gap-4">
                        <Col>
                           <div className="d-flex align-items-end gap-4">
                              <img className="img-thumbnail" src={profile.image} width={128} alt="Avatar" />
                              <div>
                                 <div className="fs-4">
                                    {profile.username}
                                 </div>
                                 <p className="mb-1 text-truncate text-secondary">
                                    {profile.bio}
                                 </p>
                              </div>
                           </div>
                        </Col>
                        <Col md="auto" className="text-center">
                           {!isMe && (
                              <Button
                                 disabled={isFollowing}
                                 variant={profileFollowing ? "outline-primary" : "primary"}
                                 onClick={handleClickFollowProfile}
                              >
                                 {!isFollowing && (
                                    <i className={classNames(
                                       "fas me-2",
                                       profileFollowing ? "fa-minus" : "fa-plus")
                                    } />
                                 )}
                                 {isFollowing && (
                                    <Spinner className="me-2" size="sm" />
                                 )}
                                 {profileFollowing ? "Unfollow" : "Follow"}
                              </Button>
                           )}

                           {isMe && (
                              <Link className="btn btn-light" to="/settings">
                                 <i className="fas fa-gear me-2" />
                                 Edit profile
                              </Link>
                           )}
                        </Col>
                     </Row>
                  </Container>
               </div>

               <Container>
                  <div className="py-5">
                     <Tab.Container
                        activeKey={activedTab}
                        onSelect={(activeKey: any) => setActivedTab(activeKey)}
                     >
                        <Row>
                           <Col md={4} xl={3}>
                              <Nav className="flex-column sticky-top bg-primary bg-opacity-15 p-3 rounded" variant="pills" style={{ top: 96 }}>
                                 <Nav.Item>
                                    <Nav.Link eventKey={Tabs.MyArticles}>
                                       <i className="fas fa-user me-2" />
                                       My articles
                                    </Nav.Link>
                                 </Nav.Item>

                                 <Nav.Item>
                                    <Nav.Link eventKey={Tabs.FavoritedArticles}>
                                       <i className="fas fa-heart me-2" />
                                       Favorited articles
                                    </Nav.Link>
                                 </Nav.Item>
                              </Nav>
                           </Col>

                           <Col md={8} xl={9} className="mt-4 mt-md-0">
                              <Tab.Content>
                                 {loadingArticles && (
                                    <div className="text-center mt-4">
                                       <Spinner />
                                    </div>
                                 )}

                                 {articles.map((article, index) => (
                                    <Article key={index} article={article} />
                                 ))}

                                 {!loadingArticles && articles.length > 0 && (
                                    <Pagination2
                                       className="mt-5"
                                       current={page}
                                       total={articlesCount}
                                       onChange={(page) => setPage(page)}
                                    />
                                 )}

                                 {!loadingArticles && articles.length === 0 && (
                                    <EmptyState
                                       icon="search"
                                       header="No articles found"
                                    />
                                 )}
                              </Tab.Content>
                           </Col>
                        </Row>
                     </Tab.Container>
                  </div>
               </Container>
            </>
         )}

         {!profile && (
            <div className="text-center mt-5">
               <Spinner />
            </div>
         )}
      </div>
   )
}
