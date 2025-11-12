import { useEffect, useState } from "react"

export const KEY = 'f83cd026'

export function useMovies (query){
      const [isLoading, setIsLoading] = useState(false)
      const [error, setError] = useState('')
        const [movies, setMovies] = useState([])

    useEffect(
      function () {
        const controller = new AbortController()

        async function fetchData() {
          try {
            setIsLoading(true)
            setError('')
            const res = await fetch(
              `https://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
              { signal: controller.signal }
            )

            if (!res.ok) {
              throw new Error('the data is not found')
            }

            const data = await res.json()

            if (data.Response === 'False') {
              throw new Error(data.Error)
            }

            setMovies(data.Search)
          } catch (err) {
            console.error(err.message)
            if (err.name === 'AbortError') return
            setError(err.message)
          } finally {
            setIsLoading(false)
          }
        }

        if (query.length < 3) {
          setError('')
          setMovies([])
          return
        }
        fetchData()
        // handleCloseSelection()
        return function () {
          controller.abort()
        }
      },
      [query]
    )
    return {movies, isLoading, error}
}