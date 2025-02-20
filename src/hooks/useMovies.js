import { useState, useEffect } from "react";
import axios from "axios";
import { getUserPreferences } from "../db/indexedDB";

const API_KEY = "473e9c4f94a1fa392df1a12c82bed991";
const API_URL = "https://api.themoviedb.org/3";

const genreMap = {
  28: "Acción",
  12: "Aventura",
  16: "Animación",
  35: "Comedia",
  80: "Crimen",
  99: "Documental",
  18: "Drama",
  10751: "Familia",
  14: "Fantasía",
  27: "Terror",
  36: "Historia",
  10402: "Música",
  9648: "Misterio",
  10749: "Romance",
  878: "Ciencia Ficción",
  10770: "Película de TV",
  53: "Suspense",
  10752: "Bélica",
  37: "Western",
};

const getGenreNames = (genreIds) => {
  return genreIds.map((id) => genreMap[id] || "Desconocido");
};

const fetchTrailer = async (movieId) => {
  try {
    const response = await axios.get(`${API_URL}/movie/${movieId}/videos`, {
      params: {
        api_key: API_KEY,
        language: "es",
      },
    });
    const trailer = response.data.results.find(
      (video) => video.type === "Trailer" && video.site === "YouTube"
    );
    return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;
  } catch (error) {
    return null;
  }
};

const useMovies = (yearRange) => {
  const [movies, setMovies] = useState([]);

  const fetchMovies = async (range) => {
    try {
      const userPreferences = await getUserPreferences();
      if (!userPreferences.selectedGenres) return;

      const genreIds = userPreferences.selectedGenres.map((genre) =>
        Object.keys(genreMap).find((key) => genreMap[key] === genre)
      );

      const sortBy =
        userPreferences.preference === "rating"
          ? "vote_average.desc"
          : "popularity.desc";

      const response = await axios.get(`${API_URL}/discover/movie`, {
        params: {
          api_key: API_KEY,
          language: "es",
          with_genres: genreIds.join(","),
          sort_by: sortBy,
          page: 1,
          "primary_release_date.gte": `${range.start}-01-01`,
          "primary_release_date.lte": `${range.end}-12-31`,
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
            genres: getGenreNames(movie.genre_ids),
            trailer: trailerUrl,
          };
        })
      );

      setMovies(moviesWithTrailers);
    } catch (error) {
      console.error("Error fetching movies", error);
    }
  };

  const addNewMovie = async (fromList = false) => {
    try {
      const userPreferences = await getUserPreferences();
      if (!userPreferences.selectedGenres) return;

      const genreIds = userPreferences.selectedGenres.map((genre) =>
        Object.keys(genreMap).find((key) => genreMap[key] === genre)
      );

      const sortBy =
        userPreferences.preference === "rating"
          ? "vote_average.desc"
          : "popularity.desc";

      const response = await axios.get(`${API_URL}/discover/movie`, {
        params: {
          api_key: API_KEY,
          language: "es",
          with_genres: genreIds.join(","),
          sort_by: sortBy,
          "primary_release_date.gte": `${yearRange.start}-01-01`,
          "primary_release_date.lte": `${yearRange.end}-12-31`,
        },
      });

      const seenMovies = userPreferences.watchedMovies || [];
      const filteredMovies = response.data.results.filter(
        (movie) => !seenMovies.includes(movie.id)
      );

      const newMovie = filteredMovies[0];
      const trailerUrl = await fetchTrailer(newMovie.id);
      const movieWithTrailer = {
        id: newMovie.id,
        title: newMovie.title,
        year: newMovie.release_date.split("-")[0],
        image: `https://image.tmdb.org/t/p/w500${newMovie.poster_path}`,
        rating: newMovie.vote_average,
        genres: getGenreNames(newMovie.genre_ids),
        trailer: trailerUrl,
      };

      setMovies((prevMovies) => fromList ? [...prevMovies, movieWithTrailer] : [movieWithTrailer, ...prevMovies]);
    } catch (error) {
      console.error("Error adding new movie", error);
    }
  };

  const removeMovie = (movieId) => {
    setMovies((prevMovies) => prevMovies.filter((movie) => movie.id !== movieId));
  };

  useEffect(() => {
    fetchMovies(yearRange);
  }, [yearRange]);

  return { movies, fetchMovies, addNewMovie, removeMovie };
};

export default useMovies;
