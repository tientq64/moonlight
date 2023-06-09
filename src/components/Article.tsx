import { Link } from "react-router-dom"
import dayjs from "dayjs"

import { IArticle } from "../types"

interface IProps {
   article: IArticle
}

export function Article({ article }: IProps) {
   return (
      <div className="flex flex-col gap-4 py-6">
         <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
               <img className="rounded" src={article.author.image} alt="Avatar" />

               <div className="flex flex-col leading-4">
                  <Link className="text-green-600" to={`@${article.author.username}`}>
                     {article.author.username}
                  </Link>
                  <small className="text-slate-400">
                     {dayjs(article.createdAt).format("MMMM D, YYYY")}
                  </small>
               </div>
            </div>

            <button
               className="inline-flex items-center gap-1 px-2 border border-green-500 rounded text-green-600 hover:bg-green-500 hover:text-white"
            >
               <i className="fas fa-heart" />
               {article.favoritesCount}
            </button>
         </div>

         <Link to={`article/${article.slug}`}>
            <div className="text-2xl text-slate-900">{article.title}</div>
            <p className="mt-1 text-slate-400">{article.description}</p>

            <div className="flex justify-between items-end mt-4 text-sm">
               <div className="text-slate-400">Read more...</div>

               <div className="flex flex-wrap gap-1">
                  {article.tagList.map((tag) => (
                     <button className="px-2 py-0.5 border rounded text-slate-400 hover:bg-slate-100">
                        {tag}
                     </button>
                  ))}
               </div>
            </div>
         </Link>
      </div>
   )
}
