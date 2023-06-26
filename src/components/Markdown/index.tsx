import classNames from "classnames"
import { markdownToHtml } from "../../utils"
import styles from "./styles.module.scss"
import { MarkdownProps } from "./types"

export const Markdown = ({ className, content }: MarkdownProps) => {
   return (
      <div
         className={classNames(
            styles.markdown,
            className
         )}
         dangerouslySetInnerHTML={{ __html: markdownToHtml(content) }}
      />
   )
}
