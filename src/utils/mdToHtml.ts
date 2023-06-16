import MarkdownIt from "markdown-it"

export const mdToHtml = (markdown: string): string => {
   return MarkdownIt().render(markdown)
}
