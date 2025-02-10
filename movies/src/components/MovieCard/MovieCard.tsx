import React, { useState, useEffect, useContext } from 'react'

import { Movie } from '../Types/types'
import TMBDService from '../../services/TMBDService'
import ShortDescription from '../ShortDescription/ShortDescription'
import { Rate, Card } from 'antd'
import './MovieCard.css'
import {GenresContext} from '../App/App'

const MoviesCard: React.FC<Movie> = ({
  id: movieId,
  title = '',
  description = '',
  imgUrl = '',
  releaseDate = '',
  voteAverage = 0,
  voteAverageColor = '#e90000',
  guestSession = null,
  ratings,
  setRating,
  genreIds,
}) => {
  const [starRating, setStarRating] = useState<number | null>(ratings[movieId] || null)
  const api = new TMBDService()
  const genres = useContext(GenresContext)

  useEffect(() => {
    if (starRating !== null && starRating > 0) {
      setRating(movieId, starRating)
    } else if (starRating === 0) {
      setRating(movieId, 0)
    }
  }, [starRating, movieId, setRating])

  const handleRateChange = (value: number) => {
    setStarRating(value)
    if (guestSession) {
      api.rateMovie(movieId, guestSession, value)
    }
  }

  const getGenresArray = (genreIds: number[]): string[] => {
    return genres.filter((genre) => genreIds.includes(genre.id)).map((genre) => genre.name)
  }

  const genresArray = getGenresArray(genreIds)

  const titleShort = (title: string, maxLength: number) => {
    if (title.length > maxLength) {
      return `${title.slice(0, maxLength - 3)}...`
    }
    return title
  }

  return (
    <Card style={{ width: 451, borderRadius: 0, border: 0 }}>
      <div className="card-content">
        <li className="card">
          <img alt="example" src={imgUrl} className="poster-movie" />
          <h5 className="title">{titleShort(title, 25)}</h5>
          <div className="rating">
            <div className="rating-info" style={{ borderColor: voteAverageColor }}>
              {voteAverage}
            </div>
          </div>
          <div className="info">
            <p className="card-info_date">{releaseDate}</p>
            <ul className="card-info_genres">
              {genresArray.map((genre, index) => (
                <li key={index}>{genre}</li>
              ))}
            </ul>
          </div>
          <div className="desc">
            <ShortDescription description={description} />
          </div>
          <div className="star-container">
            <Rate className="star" count={10} allowHalf value={starRating} onChange={handleRateChange} />
          </div>
        </li>
      </div>
    </Card>
  )
}

export default MoviesCard
