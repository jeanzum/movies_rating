import useMovies from '../hooks/useMovies';
import useUserPreferences from '../hooks/useUserPreferences';
import MovieCard from '../components/MovieCard';

const MovieList = () => {  
    const {movies} = useMovies();
    const {preferences, updatePreferences} = useUserPreferences();
    return (
        <div className="movie-list">
            {movies.map((movie) => (
                <MovieCard 
                key={movie.id} 
                movie={movie}
                preferences={preferences}
                updatePreference={updatePreferences}
                 />
            ))}
        </div>
    );

};    

export default MovieList;