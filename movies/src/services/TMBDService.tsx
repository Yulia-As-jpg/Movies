import { Movie, ApiResponse, HttpMethod } from '../components/Types/types'

class TMBDService {
  private baseUrl: string
  private apiKey: string
  private imgUrl: string

  constructor() {
    this.baseUrl = 'https://api.themoviedb.org/3'
    this.apiKey = '36292c9d1b6c5d53562c6f739baf02ba'
    this.imgUrl = 'https://media.themoviedb.org/t/p/w220'
  }

  private _endURL(endpoint: string, params = '') {
    return `${this.baseUrl}${endpoint}?api_key=${this.apiKey}${params}`
  }

  private async _req(url: string, method: HttpMethod = 'get', body: any = null): Promise<ApiResponse> {
    const options: RequestInit = {
      method: method.toUpperCase(),
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
      ...(body && { body: JSON.stringify(body) }),
    }

    try {
      const res = await fetch(url, options)
      if (!res.ok) {
        const text = await res.text()
        throw new Error(text)
      }

      const data = await res.json()
      return this._transformData(data)
    } catch (error) {
      console.error('Fetch error:', error)
      throw error
    }
  }

  async requestMovies(query: string, page: number = 1): Promise<ApiResponse> {
    const url = this._endURL('/search/movie', `&query=${query}&page=${page}`)
    return this._req(url)
  }

  async requestSession(): Promise<ApiResponse> {
    const url = this._endURL('/authentication/guest_session/new')
    return this._req(url)
  }

  async requestRatedMovies(authId: string): Promise<ApiResponse> {
    const url = this._endURL(`/guest_session/${authId}/rated/movies`)
    return this._req(url)
  }

  async rateMovie(movieId: number, sessionId: string, rateValue: number): Promise<ApiResponse> {
    const url = this._endURL(`/movie/${movieId}/rating`, `&guest_session_id=${sessionId}`)

    const method = Math.ceil(rateValue) ? 'post' : 'delete'
    return this._req(url, method, { value: rateValue })
  }

  async requestGenres(): Promise<ApiResponse> {
    const url = this._endURL(`/genre/movie/list`)
    return this._req(url)
  }

  private _transformData(data: ApiResponse): ApiResponse {
    if (!Array.isArray(data.results)) return data
    const movies = data.results.map((movie: any) => ({
      id: movie.id,
      title: movie.title,
      description: movie.overview,
      imgUrl: movie.poster_path,
      releaseDate: movie.release_date,
      voteAverage: movie.vote_average,
      genreIds: movie.genre_ids,
      rating: movie.rating || 0,
    }))

    return {
      ...data,
      results: movies,
    }
  }
}

export default TMBDService
