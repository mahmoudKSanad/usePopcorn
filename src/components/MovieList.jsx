export default function MovieList({ movies, onSelection }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie key={movie.imdbID} movie={movie} onSelection={onSelection} />
      ))}
    </ul>
  )
}

function Movie({ movie, onSelection }) {
  return (
    <li className="list" onClick={() => onSelection(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  )
}
