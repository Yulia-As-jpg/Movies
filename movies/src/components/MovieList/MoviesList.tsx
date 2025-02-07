import React, { useState, useEffect, useCallback } from 'react'
import { format } from 'date-fns'
import MovieCard from '../MovieCard/MovieCard'
import { imgSrc, voteColor } from '../utils/utils'
import { Alert, Spin } from 'antd'

import { MoviesProps } from '../Types/types'

const MoviesList: React.FC<MoviesProps> = ({
  moviesData,
  isLoading,
  isError,
  errorMessage,
  guestSession,
  activeTab,
  genres,
  ratings,
  setRating,
}) => {
  const message = activeTab === '1' ? 'The search not given any results' : 'No rated films'

  const renderMovies = useCallback(() => {
    if (!moviesData.length) {
      return <Alert message={message} type="info" />
    }

    return moviesData.map((movie) => {
      const { id, title, description, imgUrl, releaseDate, voteAverage, rating, genreIds } = movie

      const genreNames = genres
        .filter((genre) => genreIds.includes(genre.id))
        .map((genre) => genre.name)
        .join(', ')

      return (
        <MovieCard
          key={id}
          id={id}
          title={title}
          description={description || ''}
          imgUrl={imgSrc(imgUrl)}
          releaseDate={releaseDate ? format(new Date(releaseDate), 'PP') : 'Data unknown'}
          voteAverage={+voteAverage.toFixed(1)}
          rating={rating}
          genres={genreNames}
          guestSession={guestSession}
          voteAverageColor={voteColor(voteAverage)}
          genreIds={genreIds}
          ratings={ratings}
          setRating={setRating}
        />
      )
    })
  }, [moviesData, genres, guestSession, imgSrc, voteColor, message])

  const error =
    isError || !navigator.onLine ? (
      <Alert message={!navigator.onLine ? 'No internet connection' : errorMessage} type="error" />
    ) : null
  const spinner = !isError && isLoading && navigator.onLine ? <Spin /> : null
  const content = isLoading || isError || !navigator.onLine ? null : renderMovies()

  return (
    <div className="app__movies movies">
      {error}
      {spinner}
      {content}
    </div>
  )
}

export default MoviesList
