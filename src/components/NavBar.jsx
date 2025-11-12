import { useEffect, useRef } from 'react'
import { useKey } from '../Hooks/useKey'

export function NavBar({ children }) {
  return <nav className="nav-bar">{children}</nav>
}

export function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  )
}

export function Search({ query, setQuery }) {
  const inputEle = useRef(null)

  // Enter Action
  // useEffect(
  //   function () {
  //     const callBack = function (e) {
  //       if (e.code === 'Enter') {

  //       }
  //     }
  //     document.addEventListener('keydown', callBack)
  //     return () => document.removeEventListener('keydown', callBack)
  //   },
  //   [setQuery]
  // )
  useKey('enTer', function () {
    if (document.activeElement === inputEle.current) return
    setQuery('')
    inputEle.current.focus()  
  })

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEle}
    />
  )
}

export function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  )
}
