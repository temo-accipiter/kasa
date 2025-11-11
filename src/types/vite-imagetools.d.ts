/**
 * Type declarations for vite-imagetools
 * Permet d'importer des images avec des directives de transformation
 */

declare module "*?w=*&format=webp" {
  const url: string
  export default url
}

declare module "*?w=*&format=avif" {
  const url: string
  export default url
}

declare module "*?w=*&format=jpg&quality=*" {
  const url: string
  export default url
}

declare module "*?format=webp" {
  const url: string
  export default url
}

declare module "*?format=avif" {
  const url: string
  export default url
}

declare module "*?format=jpg" {
  const url: string
  export default url
}

// Générique pour toutes les transformations d'images
declare module "*?*" {
  const url: string
  export default url
}
