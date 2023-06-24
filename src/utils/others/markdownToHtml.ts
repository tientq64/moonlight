import MarkdownIt from "markdown-it"

export const markdownToHtml = (markdown: string): string => {
   const markdownIt: MarkdownIt = MarkdownIt({
      breaks: true
   })
   const html: string = markdownIt.render(markdown)
   return html
}
