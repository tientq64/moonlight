import classNames from "classnames"
import { Button, Container, Dropdown, Nav, Navbar } from "react-bootstrap"
import { Link, NavLink } from "react-router-dom"
import { useLogout, useUser } from "../../hooks"
import styles from "./styles.module.scss"

export const Header = () => {
   const [user] = useUser()
   const logout = useLogout()

   const handleClickSignOut = (): void => {
      logout()
   }

   return (
      <Navbar className={classNames("shadow", styles.navbar)} bg="dark" variant="dark" sticky="top">
         <Container>
            <Navbar.Brand as={Link} className="fw-semibold d-flex" to="/">
               {/* <img className={styles.logo} src={logo} alt="Logo" /> */}
               Moon
            </Navbar.Brand>

            <Navbar.Collapse>
               <Nav className="ms-auto">
                  {/* <Nav.Link as={NavLink} to="/" end>
                     <i className="fas fa-home me-2"></i>
                     Home
                  </Nav.Link> */}

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
                        <Nav.Link as={NavLink} to={`/profile/${user.username}`}>
                           <img className="rounded me-2" src={user.image} width={32} alt="Avatar" />
                           {user.username}
                        </Nav.Link>

                        <Dropdown className="d-flex" align="end">
                           <Dropdown.Toggle as={Button} variant="dark">
                              <i className="fas fa-bars" />
                           </Dropdown.Toggle>

                           <Dropdown.Menu className="dropdown-menu-animate shadow">
                              <Dropdown.Item as={NavLink} to="/editor">
                                 <i className="fas fa-edit me-2"></i>
                                 New article
                              </Dropdown.Item>

                              <Dropdown.Divider />

                              <Dropdown.Item>
                                 <i className="fas fa-circle-half-stroke me-2"></i>
                                 Dark mode
                              </Dropdown.Item>

                              <Dropdown.Item>
                                 <i className="fas fa-language me-2"></i>
                                 Language
                              </Dropdown.Item>

                              <Dropdown.Divider />

                              <Dropdown.Item as={NavLink} to="/settings">
                                 <i className="fas fa-gear me-2"></i>
                                 Settings
                              </Dropdown.Item>

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
