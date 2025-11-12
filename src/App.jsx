import { useState } from 'react'
import { NavBar, Logo, Search, NumResults } from './components/NavBar'
import WatchedList from './components/WatchedList'
import MovieDetails from './components/MovieDetails'
import MovieList from './components/MovieList'
import Main from './components/Main'
import Box from './components/Box'
import { ErrorMessage, Loader } from './components/Messages'
import WatchedSummary from './components/WatchedSummary'
import { useMovies } from './Hooks/useMovies'
import { useLocalStorageState } from './Hooks/useLocalStorageState'

export const KEY = 'f83cd026'

export default function App() {
  // const [watched, setWatched] = useState(function () {
  //   const storedData = JSON.parse(localStorage.getItem('watched'))
  //   return storedData
  // })

  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState(null)

  function handleSelection(id) {
    setSelectedId((selectedId) => (selectedId === id ? null : id))
  }
  function handleCloseSelection() {
    setSelectedId(null)
  }

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie])
  }

  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id))
  }

  // Fetch Data
  // useEffect(
  //   function () {
  //     const controller = new AbortController()

  //     async function fetchData() {
  //       try {
  //         setIsLoading(true)
  //         setError('')
  //         const res = await fetch(
  //           `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
  //           { signal: controller.signal }
  //         )

  //         if (!res.ok) {
  //           throw new Error('the data is not found')
  //         }

  //         const data = await res.json()

  //         if (data.Response === 'False') {
  //           throw new Error(data.Error)
  //         }

  //         setMovies(data.Search)
  //       } catch (err) {
  //         console.error(err.message)
  //         if (err.name === 'AbortError') return
  //         setError(err.message)
  //       } finally {
  //         setIsLoading(false)
  //       }
  //     }

  //     if (query.length < 3) {
  //       setError('')
  //       setMovies([])
  //       return
  //     }
  //     fetchData()
  //     handleCloseSelection()
  //     return function () {
  //       controller.abort()
  //     }
  //   },
  //   [query]
  // )
  const { movies, isLoading, error } = useMovies(query)

  // Store the data into the localStorage
  // useEffect(
  //   function () {
  //     localStorage.setItem('watched', JSON.stringify(watched))
  //   },
  //   [watched]
  // )
  const [watched, setWatched] = useLocalStorageState([], 'watched')

  return (
    <>
      <NavBar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {!isLoading && !error && (
            <MovieList movies={movies} onSelection={handleSelection} />
          )}
          {error && <ErrorMessage message={error} />}
          {isLoading && <Loader />}
        </Box>

        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovies={handleCloseSelection}
              onAddMovie={handleAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  )
}
