export type EmptyStateIconProp = string | JSX.Element | null
export type EmptyStateHeaderProp = string | JSX.Element | null

export interface EmptyStateProps {
   icon?: EmptyStateIconProp
   header?: EmptyStateHeaderProp
   content?: any
}
