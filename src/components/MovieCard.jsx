import { addWatchedMovie } from "../db/indexedDB";


const MovieCard = ({ movie, preferences, updatePreference }) => {
    const userStatus = preferences[movie.id] || "unseen";

    const handleMarkAsWatched = async (movieId) => {
        await addWatchedMovie(movieId);
        updatePreference(movieId, 'seen');
      };
  
    
    return (
        <div className="movie-card">
            <img src={movie.image} alt={movie.title} />
            <h3>{movie.title}</h3>
            <p>({movie.year}) • {movie.genres.join(", ")} </p>
            <p>⭐ {Math.round(movie.rating)}</p>
            {movie.trailer ? (
            <a href={movie.trailer} target="_blank" rel="noopener noreferrer" className="trailer-button">
                🎬 Ver Tráiler
                </a>
            ) : (
                <p>No hay tráiler disponible</p>
            )}
            <div className="action">
                <button 
                className={userStatus === "liked" ? "active" : ""}
                onClick={() => updatePreference(movie.id, 'liked')}>
                    👍 
                </button>

                <button 
                className={userStatus === "disliked" ? "active" : ""}
                onClick={() => updatePreference(movie.id, 'disliked')}>
                    👎
                </button>
                <button
                className={userStatus === "seen" ? "active" : ""}
                onClick={() => handleMarkAsWatched(movie.id)}>
                    🚫
                </button>
            </div>
        </div>
    );
};

export default MovieCard;