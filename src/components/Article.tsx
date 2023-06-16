import { MouseEvent, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "react-bootstrap"
import dayjs from "dayjs"

import { deleteArticlesFavorite, postArticlesFavorite } from "../utils"
import { RootState } from "../store"
import { IArticle } from "../types"

interface IProps {
   article: IArticle
}

export function Article({ article }: IProps) {
   const [favorited, setFavorited] = useState(article.favorited)
   const [favoritesCount, setFavoritesCount] = useState(article.favoritesCount)
   const [favoriting, setFavoriting] = useState(false)
   const user = useSelector((state: RootState) => state.user.user)
   const navigate = useNavigate()

   const handleClickFavoriteButton = () => {
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

   useEffect(() => {
      setFavorited(article.favorited)
   }, [article])

   return (
      <div className="py-3">
         <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-3">
               <Link to={`/profile/${article.author.username}`}>
                  <img className="rounded" src={article.author.image} width={32} alt="Avatar" />
               </Link>

               <div className="d-flex flex-column lh-sm">
                  <Link className="text-decoration-none text-primary" to={`/profile/${article.author.username}`}>
                     {article.author.username}
                  </Link>
                  <small className="text-secondary">
                     {dayjs(article.createdAt).format("MMMM D, YYYY")}
                  </small>
               </div>
            </div>

            <Button
               size="sm"
               variant={favorited ? "primary" : "outline-primary"}
               disabled={favoriting}
               onClick={handleClickFavoriteButton}
            >
               <i className="fas fa-heart me-2" />
               {favoritesCount}
            </Button>
         </div>

         <Link className="d-block mt-3 text-decoration-none" to={`/article/${article.slug}`}>
            <div className="fs-4 text-black text-truncate word-break">
               {article.title}
            </div>
            <div className="text-secondary word-break">
               {article.description}
            </div>

            <div className="d-flex mt-3 justify-content-between">
               <small className="text-secondary">Read more...</small>
               <div className="d-flex flex-wrap gap-1">
                  {article.tagList.map((tag, index) => (
                     <Button
                        key={index}
                        className="py-0 text-truncate"
                        style={{ maxWidth: 320 }}
                        variant="outline-secondary"
                        size="sm"
                        onClick={(event: MouseEvent) => {
                           event.preventDefault()
                        }}
                     >
                        {tag}
                     </Button>
                  ))}
               </div>
            </div>
         </Link>
      </div>
   )
}
