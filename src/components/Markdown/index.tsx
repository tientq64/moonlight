import { markdownToHtml } from "../../utils"
import styles from "./styles.module.scss"
import { Props } from "./types"

export const Markdown = ({ content }: Props) => {
   return (
      <p
         className={styles.markdown}
         dangerouslySetInnerHTML={{ __html: markdownToHtml(content) }}
      />
   )
}
