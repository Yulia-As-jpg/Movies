export interface AppState {
  totalPages: number | null
  currentPage: number
  loading: boolean
  error: boolean
  errorMessage: string | null
  query: string | undefined
  moviesData: Movie[]
  guestSession: string | null
  activeTab: string
}

export interface Movie {
  id: number
  title: string
  description: string
  imgUrl: string
  releaseDate: string
  voteAverage: number
  genreIds: number[]
  rating?: number
  voteAverageColor?: string
  genres?: string
  guestSession?: string | null
  ratings: { [key: number]: number }
  setRating: (movieId: number, rating: number) => void
}

export interface MoviesProps {
  moviesData: Movie[]
  isLoading: boolean
  isError: boolean
  errorMessage: string | null
  guestSession: string | null
  genres: { id: number; name: string }[]
  activeTab: string
  ratings: { [key: number]: number }
  setRating: (movieId: number, rating: number) => void
}

export interface SearchFormProps {
  onSearchProgress: () => void
  onSearchChange: (query: string) => void
  query?: string
}

export interface ApiResponse {
  results: Movie[]
  [key: string]: any
  page: number
  total_pages: number | null
  guestSession?: string | null
  genres: Genre[]
}

export type HttpMethod = 'get' | 'post' | 'delete'

export interface Genre {
  id: number
  name: string
}

export interface ShortDescriptionProps {
  description: string
}
