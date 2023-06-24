import { IProfile } from "."

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

export interface IArticleEdit {
   title: string
   description: string
   body: string
   tagList: string[]
}
