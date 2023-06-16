import { useSelector } from "react-redux"
import { Link, NavLink, useNavigate } from "react-router-dom"
import { Container, Dropdown, Nav, Navbar } from "react-bootstrap"

import { RootState } from "../store"
import { useLogout } from "../utils"
import { IUser } from "../types"

export function Header() {
   const user: IUser | null = useSelector((state: RootState) => state.user.user)
   const navigate = useNavigate()
   const logout = useLogout()

   const handleClickSignOut = () => {
      logout()
   }

   return (
      <Navbar className="shadow" style={{ zIndex: 10000 }} bg="dark" variant="dark" sticky="top">
         <Container>
            <Navbar.Brand as={Link} className="fw-semibold" to="/">
               Conduit
            </Navbar.Brand>

            <Navbar.Collapse>
               <Nav className="ms-auto">
                  <Nav.Link as={NavLink} to="/" end>
                     <i className="fas fa-home me-2"></i>
                     Home
                  </Nav.Link>

                  {!user && (
                     <>
                        <Nav.Link as={NavLink} to="/login">
                           <i className="fas fa-right-to-bracket me-2"></i>
                           Sign in
                        </Nav.Link>

                        <Nav.Link as={NavLink} to="/register">
                           <i className="fas fa-user-plus me-2"></i>
                           Sign up
                        </Nav.Link>
                     </>
                  )}

                  {user && (
                     <>
                        <Nav.Link as={NavLink} to="/editor">
                           <i className="fas fa-edit me-2"></i>
                           New Article
                        </Nav.Link>

                        <Nav.Link as={NavLink} to={`/profile/${user.username}`}>
                           <img className="rounded me-2" src={user.image} width={32} alt="Avatar" />
                           {user.username}
                        </Nav.Link>

                        <Dropdown
                           className="d-flex"
                           align="end"
                        >
                           <Dropdown.Toggle id="user-menu" className="d-flex" variant="dark" />

                           <Dropdown.Menu className="dropdown-menu-animate shadow">
                              <Dropdown.Item as={NavLink} to="/settings">
                                 <i className="fas fa-gear me-2"></i>
                                 Settings
                              </Dropdown.Item>

                              <Dropdown.Divider />

                              <Dropdown.Item className="text-danger" onClick={handleClickSignOut}>
                                 <i className="fas fa-right-from-bracket me-2"></i>
                                 Sign out
                              </Dropdown.Item>
                           </Dropdown.Menu>
                        </Dropdown>
                     </>
                  )}
               </Nav>
            </Navbar.Collapse>
         </Container>
      </Navbar >
   )
}
