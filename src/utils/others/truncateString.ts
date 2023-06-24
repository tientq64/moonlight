export const truncateString = (str: string, len: number): string => {
   if (str.length > len) {
      return str.substring(0, len - 1) + "\u2026"
   }
   return str
}
