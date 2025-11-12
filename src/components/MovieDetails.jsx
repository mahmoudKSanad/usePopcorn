import { useState, useEffect, useRef } from 'react'
import StarRating from './StarRating'
import { Loader } from './Messages'
import { KEY } from '../App'
import { useKey } from '../Hooks/useKey'

export default function MovieDetails({
  selectedId,
  onCloseMovies,
  onAddMovie,
  watched,
}) {
  const [movie, setMovie] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [userRating, setUserRating] = useState('')
  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId)
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating

  const countRef = useRef(0)

  useEffect(
    function () {
      if (userRating) countRef.current++
    },
    [userRating]
  )
  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie

  // Escape key action
  // useEffect(
  //   function () {
  //     document.addEventListener('keydown', function (e) {
  //       if (e.code === 'Escape') {
  //         onCloseMovies()
  //       }
  //     })
  //     return function () {
  //       document.removeEventListener('keydown', function (e) {
  //         if (e.code === 'Escape') {
  //           onCloseMovies()
  //         }
  //       })
  //     }
  //   },
  //   [onCloseMovies]
  // )
  useKey('Escape', onCloseMovies)

  function handleAddWatched() {
    const newMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(' ').at(0)),
      userRating,
      countUserRating: countRef.current,
    }
    onAddMovie(newMovie)
    onCloseMovies()
  }

  useEffect(
    function () {
      async function fetchMovie() {
        setIsLoading(true)
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
        )
        const data = await res.json()
        setMovie(data)
        setIsLoading(false)
      }
      fetchMovie()
    },
    [selectedId]
  )

  useEffect(
    function () {
      if (!title) return
      document.title = `MOVIE: ${title}`

      return function () {
        document.title = 'usePopcorn'
      }
    },
    [title]
  )
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : movie.Title ? (
        <div className="details">
          <header>
            <button className="btn-back" onClick={onCloseMovies}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${title} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐️</span>
                {imdbRating} IMDb rating
              </p>
            </div>
          </header>

          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetRating={setUserRating}
                  />
                  <button className="btn-add" onClick={handleAddWatched}>
                    + Add To List
                  </button>
                </>
              ) : (
                <p>
                  You Rated This Movie {watchedUserRating}
                  <span>⭐️</span>
                </p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </div>
      ) : null}
    </>
  )
}
