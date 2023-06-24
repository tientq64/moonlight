import { IProfile } from "."

export interface IArticleComment {
   id: number
   createdAt: string
   updatedAt: string
   body: string
   author: IProfile
}
