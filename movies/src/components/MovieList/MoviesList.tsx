import React, { useState, useEffect, useCallback } from 'react'
import { format } from 'date-fns'
import MovieCard from '../MovieCard/MovieCard'
import { Alert, Spin } from 'antd'
import { Flex } from 'antd'

import { MoviesProps } from '../Types/types'

const MoviesList: React.FC<MoviesProps> = ({
  moviesData,
  isLoading,
  isError,
  errorMessage,
  guestSession,
  activeTab,
  genres,
}) => {
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    const message = Number(activeTab) === 1 ? 'The search not given any results' : 'No rated films'
    setMessage(message)
  }, [activeTab])

  useEffect(() => {
    const message = Number(activeTab) === 1 ? 'Enter your search term' : 'No rated films'
    setMessage(message)
  }, [moviesData, activeTab])

  const makeTeaser = useCallback((text: string) => {
    if (!text) return null
    let teaser = text.split(' ').splice(0, 18).join(' ')

    if (teaser.match(/[.,!?]$/)) teaser = teaser.replace(/[.,!?]$/, ' ...')
    else teaser += ' ...'

    return teaser
  }, [])

  const imgSrc = useCallback((img: string) => {
    return img
      ? `https://image.tmdb.org/t/p/original/${img}`
      : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTE1BFq0h-RvrEBWCMPudD2QMYcG2BDJVDYNw&usqp=CAU'
  }, [])

  const voteColor = useCallback((vote: number) => {
    let voteAverageColor
    if (vote > 7) voteAverageColor = '#66e900'
    else if (vote > 5) voteAverageColor = '#e9d100'
    else if (vote > 3) voteAverageColor = '#e97e00'
    else voteAverageColor = '#e90000'
    return voteAverageColor
  }, [])

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
          />
      )
    })
  }, [moviesData, genres, guestSession, makeTeaser, imgSrc, voteColor, message])

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
