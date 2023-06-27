import dayjs from "dayjs"
import { MouseEvent, useEffect, useState } from "react"
import { Button, Card, Spinner } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import { useCreateArticleFavorite, useDeleteArticleFavorite } from "../../apis"
import { useUser } from "../../hooks"
import { truncateString } from "../../utils"
import { ArticleProps } from "./types"
import { toast } from "react-toastify"

export const Article = ({
   article,
   onClickTag
}: ArticleProps) => {
   const [user] = useUser()
   const navigate = useNavigate()

   const [favorited, setFavorited] = useState<boolean>(article.favorited)
   const [favoritesCount, setFavoritesCount] = useState<number>(article.favoritesCount)
   const [isFavoriting, setIsFavoriting] = useState<boolean>(false)

   const createArticleFavorite = useCreateArticleFavorite()
   const deleteArticleFavorite = useDeleteArticleFavorite()

   const handleClickFavoriteButton = (): void => {
      if (!user) {
         navigate("/login")
         return
      }

      const api = favorited ? deleteArticleFavorite : createArticleFavorite
      const prevFavorited = favorited
      const prevFavoritesCount = favoritesCount

      setFavorited(!favorited)
      setFavoritesCount(favoritesCount + (favorited ? -1 : 1))
      setIsFavoriting(true)

      api(article.slug)
         .then((response) => {
            setFavorited(response.data.article.favorited)
            setFavoritesCount(response.data.article.favoritesCount)
         })
         .catch((reason) => {
            setFavorited(prevFavorited)
            setFavoritesCount(prevFavoritesCount)
            toast(reason.response.data, { type: "error" })
         })
         .finally(() => {
            setIsFavoriting(false)
         })
   }

   const handleClickTag = (tag: string, event: MouseEvent): void => {
      event.preventDefault()
      onClickTag?.(tag)
   }

   useEffect(() => {
      setFavorited(article.favorited)
      setFavoritesCount(article.favoritesCount)
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
                  disabled={isFavoriting}
                  onClick={handleClickFavoriteButton}
               >
                  {isFavoriting
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
