import { IProfile } from ".."

export interface IArticle {
   slug: string
   title: string
   description: string
   body: string
   tagList: string[]
   createdAt: string
   updatedAt: string
   favorited: boolean
   favoritesCount: number
   author: IProfile
}

export interface SingleArticleResponse {
   article: IArticle
}

export interface MultipleArticlesResponse {
   articles: IArticle[]
   articlesCount: number
}

export interface NewArticle {
   title: string
   description: string
   body: string
   tagList: string[]
}

export interface NewArticleRequest {
   article: NewArticle
}

export interface UpdateArticle {
   title: string
   description: string
   body: string
   tagList: string[]
}

export interface UpdateArticleRequest {
   article: UpdateArticle
}

export interface GetArticlesParams {
   limit: number
   offset: number
   tag?: string
   author?: string
   favorited?: string
}

export interface GetArticlesFeedParams {
   limit: number
   offset: number
}
