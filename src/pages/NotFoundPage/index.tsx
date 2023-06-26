import { Container } from "react-bootstrap"
import { useLocation } from "react-router-dom"
import { EmptyState } from "../../components"

export const NotFoundPage = () => {
   const location = useLocation()

   return (
      <div>
         <Container className="py-5">
            <EmptyState
               icon={
                  <i className="fad fa-hexagon-exclamation display-5 text-danger" />
               }
               header="404. That's an error."
               content={
                  <p className="text-muted">
                     The requested URL {location.pathname} was not found on this server.
                  </p>
               }
            />
         </Container>
      </div>
   )
}
