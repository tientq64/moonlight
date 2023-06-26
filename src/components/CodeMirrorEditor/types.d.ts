export interface CodeMirrorEditorProps {
   className?: string | null
   disabled?: boolean
   placeholder?: string
   value: string
   onChange: (value: string) => void
}
