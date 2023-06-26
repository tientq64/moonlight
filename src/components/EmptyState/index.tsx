import { EmptyStateProps } from "./types"

export const EmptyState = ({
   icon,
   header,
   content
}: EmptyStateProps) => {
   const jsxIcon =
      typeof icon === "string"
         ? <i className={`fad fa-${icon} display-5 text-secondary`} />
         : icon

   const jsxHeader =
      typeof header === "string"
         ? <div className="lead fw-normal">{header}</div>
         : header

   return (
      <div className="d-flex flex-column gap-2 justify-content-center align-items-center">
         <div>
            {jsxIcon}
         </div>
         <div className="text-center">
            {jsxHeader}
         </div>
         <div>
            {content}
         </div>
      </div>
   )
}
