import { CSSProperties, useEffect, useMemo, useState } from "react"

import { Article } from "../components"
import { IArticle } from "../types"
import { getArticles, getTags } from "../utils"

export function HomePage() {
   const [loadingTags, setLoadingTags] = useState<boolean>(false)
   const [tags, setTags] = useState<string[]>([])

   const [loadingArticles, setLoadingArticles] = useState<boolean>(false)
   const [articles, setArticles] = useState<IArticle[]>([])
   const [articlesCount, setArticlesCount] = useState<number>(0)
   const [limit, setLimit] = useState<number>(10)
   const [offset, setOffset] = useState<number>(0)

   const maxOffset = useMemo(() => {
      return Math.ceil(articlesCount / limit)
   }, [articlesCount, limit])

   useEffect(() => {
      setLoadingTags(true)
      setLoadingArticles(true)

      getTags()
         .then((response) => {
            setTags(response.data.tags)
         })
         .finally(() => {
            setLoadingTags(false)
         })

      getArticles({ limit, offset })
         .then((response) => {
            setArticles(response.data.articles)
            setArticlesCount(response.data.articlesCount)
         })
         .finally(() => {
            setLoadingArticles(false)
         })
   }, [])

   return (
      <div>
         <div className="py-5 text-center text-bg-success">
            <h1 className="fs-1 fw-bold">
               C
               <i
                  className="fas fa-globe fa-bounce fs-4 align-middle"
                  style={{
                     "--fa-animation-iteration-count": 1
                  } as CSSProperties}
               />
               nduit
            </h1>
            <div className="fs-5">A place to share your knowledge.</div>
         </div>
      </div>
   )
}
