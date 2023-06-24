export type Props = {
   className?: string,
   current: number,
   total: number,
   pageSize?: number,
   onChange: (page: number) => void
}
