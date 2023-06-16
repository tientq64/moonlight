import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { Button, Col, Container, Row } from "react-bootstrap"

import { IProfile, IUser } from "../types"
import { getProfiles } from "../utils"
import { RootState } from "../store"

type Params = {
   username: string
}

export function ProfilePage() {
   const user = useSelector((state: RootState) => state.user.user)
   const { username } = useParams<Params>()
   const [profile, setProfile] = useState<IProfile | IUser | null>()
   const isMe: boolean = Boolean(user)

   useEffect(() => {
      if (!username) {
         return
      }
      if (isMe) {
         setProfile(user)
      } else {
         getProfiles(username)
            .then((response) => {
               setProfile(response.data.profile)
            })
      }
   }, [])

   return (
      <div>
         {profile && (
            <>
               <div className="py-5 text-bg-dark">
                  <Container>
                     <Row className="align-items-end gap-4">
                        <Col>
                           <div className="d-flex align-items-end gap-4">
                              <img className="img-thumbnail" src={profile.image} width={128} alt="Avatar" />
                              <div>
                                 <div className="fs-4">
                                    {profile.username}
                                 </div>
                                 <p className="mb-1 text-truncate">
                                    {profile.bio}
                                 </p>
                              </div>
                           </div>
                        </Col>
                        <Col md="auto" className="text-center">
                           <Button>
                              <i className="fas fa-plus me-2" />
                              Follow
                           </Button>
                        </Col>
                     </Row>
                  </Container>
               </div>

               <Container>
                  <div className="py-4">
                  </div>
               </Container>
            </>
         )}

         {!profile && (
            <div className="text-center mt-5">
               <i className="fas fa-spinner fa-spin fs-2" />
            </div>
         )}
      </div>
   )
}
