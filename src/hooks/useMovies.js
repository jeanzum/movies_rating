import { useState, useEffect } from "react";
import axios from "axios";
import { getUserPreferences } from "../db/indexedDB";

const API_KEY = "";
const API_URL = "https://api.themoviedb.org/3";

const getGenreId = async (genres) => {
  const genreMap = {
    Acción: 28,
    Aventura: 12,
    Animación: 16,
    Comedia: 35,
    Crimen: 80,
    Documental: 99,
    Drama: 18,
    Familia: 10751,
    Fantasía: 14,
    Terror: 27,
    Historia: 36,
    Música: 10402,
    Misterio: 9648,
    Romance: 10749,
    "Ciencia Ficción": 878,
    "Película de TV": 10770,
    Suspense: 53,
    Bélica: 10752,
    Western: 37,
  };

  return genres.map((genre) => genreMap[genre] || null).filter(Boolean);
};

const fetchTrailer = async (movieId) => {
    try {
        const response = await axios.get(`${API_URL}/movie/${movieId}/videos`, {
            params: {
                api_key: API_KEY,
                language: "es",
            },
          });
          const trailer = response.data.results.find((video) => video.type === "Trailer" && video.site === "YouTube");
          console.log(response.data.results)
          return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;

    } catch (error) {
        return null;
    }

};
  

const useMovies = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const userPreferences = await getUserPreferences();
        if (!userPreferences.selectedGenres) return;

        const genreId = await getGenreId(userPreferences.selectedGenres);
        const sortyBy =
          userPreferences.preference === "rating"
            ? "vote_average.desc"
            : "popularity.desc";

        const response = await axios.get(`${API_URL}/discover/movie`, {
          params: {
            api_key: API_KEY,
            language: "es",
            with_genres: genreId.join(","),
            sort_by: sortyBy,
          },
        });

        const seenMovies = userPreferences.watchedMovies || [];
        const filteredMovies = response.data.results.filter(
          (movie) => !seenMovies.includes(movie.id)
        );

        const moviesWithTrailers = await Promise.all(
            filteredMovies.map(async (movie) => {
                const trailerUrl = await fetchTrailer(movie.id);
                return {
                    id: movie.id,
                    title: movie.title,
                    year: movie.release_date.split("-")[0],
                    image: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
                    rating: movie.vote_average,
                    genres: movie.genre_ids,
                    trailer: trailerUrl
                }
            })
        );

        setMovies(
            moviesWithTrailers
        );
      } catch (error) {
        console.error("Error fetching movies", error);
      }
    };
    fetchMovies();
  }, []);

  return { movies };
};

export default useMovies;
