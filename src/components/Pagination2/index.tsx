import classNames from "classnames"
import { useMemo } from "react"
import { Pagination } from "react-bootstrap"
import { Pagination2Props } from "./types"

export const Pagination2 = ({
   className,
   current,
   total,
   pageSize = 10,
   onChange
}: Pagination2Props) => {
   const totalPage: number = useMemo(() => {
      return Math.ceil(total / pageSize)
   }, [pageSize, total])

   const pages: number[] = useMemo(() => {
      let newPages = [...Array(totalPage).keys()]
      if (totalPage > 7) {
         let start = Math.max(current - 4, 0)
         let end = start + 9
         if (end >= totalPage) {
            start -= end - totalPage
         }
         newPages = newPages.slice(start, end)
         if (newPages[0] > 0) {
            newPages[0] = 0
            newPages[1] = -1
         }
         if (newPages[newPages.length - 1] < totalPage - 1) {
            newPages[newPages.length - 2] = -1
            newPages[newPages.length - 1] = totalPage - 1
         }
      }
      return newPages
   }, [current, pageSize, total])

   const handleClickPage = (page: number) => {
      if (page >= 0) {
         onChange?.(page)
      }
   }

   return (
      <Pagination
         className={classNames(
            "flex-wrap justify-content-center gap-2 mt-4",
            className
         )}
      >
         <Pagination.Item
            className="d-none d-lg-block"
            disabled={!totalPage || current === 0}
            onClick={handleClickPage.bind(null, current - 1)}
         > Previous
         </Pagination.Item>

         {pages.map((page, index) => (
            <Pagination.Item
               key={index}
               active={page === current}
               disabled={page === -1}
               data-page={page}
               onClick={handleClickPage.bind(null, page)}
            >
               {page >= 0 ? page + 1 : "..."}
            </Pagination.Item>
         ))}

         <Pagination.Item
            className="d-none d-lg-block"
            disabled={!totalPage || current === totalPage - 1}
            onClick={handleClickPage.bind(null, current + 1)}
         > Next
         </Pagination.Item>
      </Pagination>
   )
}
