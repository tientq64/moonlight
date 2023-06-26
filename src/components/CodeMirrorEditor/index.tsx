import CodeMirror from "codemirror"
import "codemirror/lib/codemirror.css"
import { useEffect, useRef } from "react"
import { CodeMirrorEditorProps } from "./types"
import classNames from "classnames"
import "./styles.scss"
import "codemirror/mode/markdown/markdown"

let cm: CodeMirror.EditorFromTextArea | null = null

export const CodeMirrorEditor = ({
   className,
   disabled,
   placeholder,
   value,
   onChange
}: CodeMirrorEditorProps) => {
   const textAreaRef = useRef(null)

   useEffect(() => {
      const textAreaEl = textAreaRef.current
      if (!textAreaEl) return

      cm = CodeMirror.fromTextArea(textAreaEl, {
         mode: "markdown",
         lineWrapping: true,
         lineNumbers: true,
         showCursorWhenSelecting: true
      })
      cm.setValue(value)
      cm.clearHistory()
      cm.on("change", (cm: CodeMirror.Editor) => {
         onChange(cm.getValue())
      })

      return () => {
         cm?.toTextArea()
      }
   }, [])

   return (
      <textarea ref={textAreaRef}></textarea>
   )
}
