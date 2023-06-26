import dayjs from "dayjs"
import { MouseEvent, useEffect, useState } from "react"
import { Button, Card, Spinner } from "react-bootstrap"
import { useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { RootState } from "../../store"
import { ArticleProps } from "./types"
import { deleteArticlesFavorite, postArticlesFavorite } from "../../apis"
import { truncateString } from "../../utils"

export const Article = ({
   article,
   onClickTag
}: ArticleProps) => {
   const user = useSelector((state: RootState) => state.user.user)
   const navigate = useNavigate()

   const [favorited, setFavorited] = useState(article.favorited)
   const [favoritesCount, setFavoritesCount] = useState(article.favoritesCount)
   const [favoriting, setFavoriting] = useState(false)

   const handleClickFavoriteButton = (): void => {
      if (!user) {
         navigate("/login")
         return
      }
      const funcApi = favorited ? deleteArticlesFavorite : postArticlesFavorite
      const prevFavorited = favorited
      const prevFavoritesCount = favoritesCount

      setFavorited(!favorited)
      setFavoritesCount(favoritesCount + (favorited ? -1 : 1))
      setFavoriting(true)

      funcApi(article.slug)
         .then((response) => {
            setFavorited(response.data.article.favorited)
            setFavoritesCount(response.data.article.favoritesCount)
         })
         .catch(() => {
            setFavorited(prevFavorited)
            setFavoritesCount(prevFavoritesCount)
         })
         .finally(() => {
            setFavoriting(false)
         })
   }

   const handleClickTag = (tag: string, event: MouseEvent): void => {
      event.preventDefault()
      onClickTag?.(tag)
   }

   useEffect(() => {
      setFavorited(article.favorited)
   }, [article])

   return (
      <Card className="mb-4" border="light">
         <Card.Header>
            <div className="d-flex justify-content-between align-items-center">
               <div className="d-flex align-items-center gap-3">
                  <Link to={`/profile/${article.author.username}`}>
                     <img className="rounded" src={article.author.image} width={32} alt="Avatar" />
                  </Link>
                  <div className="d-flex flex-column lh-sm">
                     <Link
                        className="text-decoration-none text-primary"
                        to={`/profile/${article.author.username}`}
                     > {article.author.username}
                     </Link>
                     <small className="text-secondary">
                        {dayjs(article.updatedAt).format("MMMM D, YYYY")}
                     </small>
                  </div>
               </div>
               <Button
                  size="sm"
                  variant={favorited ? "primary" : "outline-primary"}
                  disabled={favoriting}
                  onClick={handleClickFavoriteButton}
               >
                  {favoriting
                     ? <Spinner size="sm" />
                     : <i className="fas fa-heart" />
                  }
                  <span className="ms-2">
                     {favoritesCount}
                  </span>
               </Button>
            </div>
         </Card.Header>

         <Card.Body>
            <Link
               className="d-block text-decoration-none"
               to={`/article/${article.slug}`}
            >
               <div className="fs-4 text-black text-break">
                  {truncateString(article.title, 120)}
               </div>
               <div className="text-secondary text-break">
                  {truncateString(article.description, 240)}
               </div>
               <div className="d-flex mt-3 justify-content-between">
                  <small className="text-secondary">Read more...</small>
                  <div className="d-flex flex-wrap gap-1">
                     {article.tagList.map((tag, index) => (
                        <Button
                           key={index}
                           className="py-0"
                           variant="outline-primary"
                           size="sm"
                           onClick={handleClickTag.bind(null, tag)}
                        > {truncateString(tag, 20)}
                        </Button>
                     ))}
                  </div>
               </div>
            </Link>
         </Card.Body>
      </Card>
   )
}
