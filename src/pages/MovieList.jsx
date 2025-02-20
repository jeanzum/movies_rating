import { useState } from 'react';
import useMovies from '../hooks/useMovies';
import useUserPreferences from '../hooks/useUserPreferences';
import MovieCard from '../components/MovieCard';

const MovieList = () => {
  const [yearRange, setYearRange] = useState({ start: 1900, end: 2025 });
  const { movies, fetchMovies, addNewMovie, removeMovie } = useMovies(yearRange);
  const { preferences, updatePreferences } = useUserPreferences();

  const handleNewMovies = () => {
    setYearRange({ start: 2020, end: 2025 });
    fetchMovies({ start: 2020, end: 2025 });
  };

  const handleOldMovies = () => {
    setYearRange({ start: 1900, end: 2019 });
    fetchMovies({ start: 1900, end: 2019 });
  };

  return (
    <div className="app-container">
      <div className="button-group">
        <button onClick={handleNewMovies}>Películas Nuevas (2020-2025)</button>
        <button onClick={handleOldMovies}>Películas Viejas (- 2020)</button>
      </div>
      <div className="movie-list">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            preferences={preferences}
            updatePreference={updatePreferences}
            removeMovie={removeMovie}
            addNewMovie={addNewMovie}
          />
        ))}
      </div>
    </div>
  );
};

export default MovieList;