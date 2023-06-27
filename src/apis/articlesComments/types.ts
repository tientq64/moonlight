import { IProfile } from ".."

export interface IComment {
   id: number
   createdAt: string
   updatedAt: string
   body: string
   author: IProfile
}

export interface SingleCommentResponse {
   comment: IComment
}

export interface MultipleCommentsResponse {
   comments: IComment[]
}

export interface NewComment {
   body: string
}

export interface NewCommentRequest {
   comment: NewComment
}
