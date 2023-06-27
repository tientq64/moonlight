import { RequireAtLeastOne } from "../../utils"

export interface LoginUser {
   email: string
   password: string
}

export interface LoginUserRequest {
   user: LoginUser
}

export interface NewUser {
   username: string
   email: string
   password: string
}

export interface NewUserRequest {
   user: NewUser
}

export interface IUser {
   email: string
   token: string
   username: string
   bio: string
   image: string
}

export interface UserResponse {
   user: IUser
}

export type UpdateUser = RequireAtLeastOne<{
   email: string
   password?: string
   username: string
   bio: string
   image: string
}>

export interface UpdateUserRequest {
   user: UpdateUser
}
