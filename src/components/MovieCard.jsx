import React, { useState } from 'react';
import { addWatchedMovie } from "../db/indexedDB";

const MovieCard = ({ movie, preferences, updatePreference, removeMovie, addNewMovie }) => {
    const userStatus = preferences[movie.id] || "unseen";
    const [showLikeDislike, setShowLikeDislike] = useState(false);

    const handleMarkAsWatched = async (movieId) => {
        await addWatchedMovie(movieId);
        updatePreference(movieId, 'seen');
        setShowLikeDislike(true);
    };

    const handleLikeDislike = async (movieId, status) => {
        if (userStatus === 'seen') {
            updatePreference(movieId, status);
            removeMovie(movieId);
            await addNewMovie(status === 'disliked');
        }
    };

    return (
        <div className="movie-card">
            <img src={movie.image} alt={movie.title} />
            <div className="movie-info">
                <h3>{movie.title}</h3>
                <p>{movie.year}</p>
                <p>Rating: ⭐ {Math.round(movie.rating)}</p>
                <p>Genres: {movie.genres.join(', ')}</p>
                {movie.trailer && (
                <a href={movie.trailer} target="_blank" rel="noopener noreferrer">
                    Ver Trailer
                </a>
                )}
                <button
                    className={userStatus === "seen" ? "active" : ""}
                    onClick={() => handleMarkAsWatched(movie.id)}>
                    Ya la vi
                </button>
                {showLikeDislike && (
                    <div className="like-dislike-buttons">
                        <button
                        className={userStatus === "liked" ? "active" : ""}
                        onClick={() => handleLikeDislike(movie.id, 'liked')}>
                            👍 
                        </button>
                        <button
                        className={userStatus === "disliked" ? "active" : ""}
                        onClick={() => handleLikeDislike(movie.id, 'disliked')}>
                            👎
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MovieCard;