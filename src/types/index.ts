export interface Host {
  name: string
  picture: string
}

export interface Logement {
  id: string
  title: string
  cover: string
  pictures: string[]
  description: string
  host: Host
  rating: string
  location: string
  equipments: string[]
  tags: string[]
}

export interface BannerProps {
  image: string
  alt: string
  text?: string
}

export interface CardProps {
  item: Logement
}

export interface CollapseProps {
  title: string
  children: React.ReactNode
}

export interface SlideshowProps {
  images: string[]
}

export interface StarRatingProps {
  rating: string
}
