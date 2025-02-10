import React, { useState, useEffect, useCallback, useMemo, createContext } from 'react'

import { Movie, ApiResponse, Genre } from '../Types/types'
import TMBDService from '../../services/TMBDService'
import SearchForm from '../SearchForm/SearchForm'
import MoviesList from '../MovieList/MoviesList'
import debounce from 'lodash/debounce'
import { Pagination, Tabs } from 'antd'
import { Layout } from 'antd'
import './App.css'

const { Header, Footer, Content } = Layout

const headerStyle: React.CSSProperties = {
  textAlign: 'center',
  height: 120,
  paddingInline: 36,
  lineHeight: '64px',
}

const footerStyle: React.CSSProperties = {
  textAlign: 'center',
}

const layoutStyle = {
  overflow: 'hidden',
}

export const GenresContext = createContext<Genre[]>([])

const App: React.FC = () => {
  const [state, setState] = useState<{
    totalPages: number | null
    currentPage: number
    loading: boolean
    error: boolean
    errorMessage: string | null
    query: string
    moviesData: Movie[]
    guestSession: string | null
    activeTab: string
  }>({
    totalPages: null,
    currentPage: 1,
    loading: false,
    error: false,
    errorMessage: null,
    query: '',
    moviesData: [],
    guestSession: null,
    activeTab: '1',
  })

  const [genres, setGenres] = useState<Genre[]>([])
  const [ratings, setRatings] = useState<{ [key: number]: number }>({})

  const api = useMemo(() => new TMBDService(), [])

  useEffect(() => {
    const { guestSession } = state
    getGenres()
    if (!guestSession) getSession()
  }, [state.guestSession])

  useEffect(() => {
    const { activeTab, currentPage, query } = state
    if (query !== '') {
      if (query.match(/^\s*/)) setState((prevState) => ({ ...prevState, query: query.trim() }))
      if (query) getMovies(query, currentPage)
      if (!query) setState((prevState) => ({ ...prevState, loading: false }))
    }

    if (activeTab === '2') {
      onSearchProgress()
      getRatedMovies(currentPage)
    }
  }, [state.activeTab, state.currentPage, state.query])

  const onContentLoaded = useCallback((movies: ApiResponse) => {
    setState((prevState) => ({
      ...prevState,
      loading: false,
      totalPages: movies.total_pages,
      currentPage: movies.page,
      moviesData: movies.results,
    }))
  }, [])

  const onError = useCallback((error: any) => {
    const errorData = JSON.parse(error.message)
    setState((prevState) => ({
      ...prevState,
      error: true,
      loading: false,
      errorMessage: errorData.status_message,
    }))
  }, [])

  const onSessionSuccess = useCallback((session: any) => {
    setState((prevState) => ({
      ...prevState,
      guestSession: session.guest_session_id,
    }))
  }, [])

  const onPaginationChange = useCallback((page: number) => {
    setState((prevState) => ({
      ...prevState,
      currentPage: page,
      loading: true,
    }));
  
    const { activeTab, query } = state;
    if (activeTab === '1') {
      getMovies(query, page);
    } else if (activeTab === '2') {
      getRatedMovies(page);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}, [state.activeTab, state.query]);

  const handleSearchChange = (query: string) => {
    setState((prevState) => ({ ...prevState, query, currentPage: 1 }))
    getMovies(query, 1)
  }

  const onSearchChange = useMemo(
    () =>
      debounce((query: string) => {
        handleSearchChange(query)
      }, 300),
    []
  )

  const getMovies = useCallback(
    (query: string, page: number | undefined) => {
      api.requestMovies(query, page).then(onContentLoaded).catch(onError)
    },
    [api, onContentLoaded, onError]
  )

  const getSession = useCallback(() => {
    api.requestSession().then(onSessionSuccess)
  }, [api, onSessionSuccess])

  const getRatedMovies = useCallback(
    (page: number) => {
      const { guestSession } = state
      if (guestSession) {
        api.requestRatedMovies(guestSession, page).then(onContentLoaded).catch(onError)
      }
    },
    [api, state.guestSession, onContentLoaded, onError]
  )

  const setRating = useCallback((movieId: number, rating: number) => {
    setRatings((prevRatings) => 
      ({ ...prevRatings, [movieId]: rating }))
  }, [])

  const getGenres = useCallback(() => {
    api.requestGenres().then((response: ApiResponse) => {
      setGenres(response.genres)
    })
  }, [api])

  const onTabChange = useCallback(
    (activeTab: string) => {
      setState((prevState) => ({
        ...prevState,
        activeTab,
        error: false,
        errorMessage: null,
        moviesData: [],
        currentPage: 1,
      }))

      if (activeTab === '1') {
        handleSearchChange(state.query)
      } else if (activeTab === '2') {
        onSearchProgress()
        getRatedMovies(1)
      }
    },
    [state.query]
  )

  const onSearchProgress = useCallback(() => {
    setState((prevState) => ({ ...prevState, loading: true }))
  }, [])

  const { totalPages, currentPage, moviesData, loading, error, errorMessage, query, guestSession, activeTab } = state

  const items = [
    {
      key: '1',
      label: 'Search',
      children: <SearchForm onSearchChange={onSearchChange} onSearchProgress={onSearchProgress} query={query} />,
    },
    {
      key: '2',
      label: 'Rated',
      children: <div />,
    },
  ]

  return (
    <GenresContext.Provider value={genres}>
      <Layout style={layoutStyle}>
        <Header style={headerStyle}>
          <Tabs defaultActiveKey="1" items={items} centered onChange={onTabChange} />
        </Header>
        <Content className="app_movies movies">
          <MoviesList
            moviesData={moviesData}
            isLoading={loading}
            isError={error}
            errorMessage={errorMessage}
            guestSession={guestSession}
            activeTab={activeTab}
            ratings={ratings}
            setRating={setRating}
          />
        </Content>
        <Footer style={footerStyle}>
          <div className="app__pagination">
            {totalPages !== null && totalPages > 1 && !error && !loading && (
              <Pagination
                size="middle"
                align="center"
                total={totalPages * 10}
                showSizeChanger={false}
                current={currentPage}
                onChange={onPaginationChange}
              />
            )}
          </div>
        </Footer>
      </Layout>
    </GenresContext.Provider>
  )
}
export default App

function setQuery(query: any) {
  throw new Error('Function not implemented.')
}
