export interface ProfileResponse {
   profile: IProfile
}

export interface IProfile {
   username: string
   bio: string
   image: string
   following: boolean
}
