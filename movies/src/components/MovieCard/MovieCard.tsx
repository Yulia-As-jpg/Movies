import React, { useState, useEffect, useCallback } from 'react'

import { Movie } from '../Types/types'
import TMBDService from '../../services/TMBDService'
import ShortDescription from '../ShortDescription/ShortDescription'
import { Rate, Card } from 'antd'
import './MovieCard.css'

const MoviesCard: React.FC<Movie> = ({
  id: movieId,
  title = '',
  description = '',
  imgUrl = '',
  releaseDate = '',
  voteAverage = 0,
  rating = undefined,
  voteAverageColor = '#e90000',
  genres = '',
  guestSession = null,
}) => {
  const [starRating, setStarRating] = useState<number | null>(null)
  const api = new TMBDService()

  useEffect(() => {
    if (starRating !== null && starRating > 0) {
      setRating()
    } else if (starRating === null) {
      deleteRating()
    }
  }, [starRating])

  const setRating = useCallback(() => {
    if (starRating !== null && guestSession) {
      api.rateMovie(movieId, guestSession, starRating)
    }
  }, [starRating, guestSession, movieId])

  const deleteRating = useCallback(() => {
    if (guestSession) {
      api.rateMovie(movieId, guestSession, 0)
    }
  }, [guestSession, movieId])

  const getGenresArray = (genres: string): string[] => {
    return genres.split(',').map((genre) => genre.trim())
  }

  const genresArray = getGenresArray(genres)

  const titleShort = (title: string, maxLength: number) => {
    if (title.length > maxLength) {
      return `${title.slice(0, maxLength - 3)}...`
    }
    return title
  }

  return (
     <Card style={{ width :451, borderRadius: 0, border: 0}}>
        <div className='card-content'>
       <li className='card'>
      <img alt="example" src={imgUrl} className="poster-movie" />
         <h5 className="title">{titleShort (title, 25)}</h5>
        <div className='rating'>
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
           <Rate
             className="star"
             count={10}
             allowHalf
             defaultValue={rating || starRating}
             onChange={(st: number) => setStarRating(st)}
           />
         </div>
       </li>
     </div>
     </Card>
    
      
     
  )
}

export default MoviesCard
