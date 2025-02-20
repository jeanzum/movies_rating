import { useState, useEffect } from "react";
import { getUserPreferences, setUserPreferences } from "../db/indexedDB";

const genres = [
  "Acción", "Aventura", "Comedia", "Drama", "Terror", "Ciencia Ficción", "Animación", "Romance",
];

const EditPreferences = ({ onComplete }) => {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [favoriteMovies, setFavoriteMovies] = useState(["", "", ""]);
  const [preference, setPreference] = useState("rating");

  useEffect(() => {
    const fetchPreferences = async () => {
      const storedPreferences = await getUserPreferences();
      if (storedPreferences) {
        setSelectedGenres(storedPreferences.selectedGenres || []);
        setFavoriteMovies(storedPreferences.favoriteMovies || ["", "", ""]);
        setPreference(storedPreferences.preference || "rating");
      }
    };
    fetchPreferences();
  }, []);

  const toggleGenre = (genre) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const handleSubmit = async () => {
    const userPreferences = { selectedGenres, favoriteMovies, preference };
    await setUserPreferences(userPreferences);
    onComplete(userPreferences);
  };

  return (
    <div className="onboarding">
      <h2>Modifica tus intereses</h2>

      <div>
        <h3>1. ¿Qué géneros te gustan?</h3>
        <div className="genres">
          {genres.map((genre) => (
            <button
              key={genre}
              className={selectedGenres.includes(genre) ? "selected" : ""}
              onClick={() => toggleGenre(genre)}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3>2. ¿Cuáles son tus 3 películas favoritas?</h3>
        {favoriteMovies.map((movie, index) => (
          <input
            key={index}
            type="text"
            placeholder={`Película ${index + 1}`}
            value={movie}
            onChange={(e) => {
              const newFavorites = [...favoriteMovies];
              newFavorites[index] = e.target.value;
              setFavoriteMovies(newFavorites);
            }}
          />
        ))}
      </div>

      <div>
        <h3>3. ¿Cómo prefieres las recomendaciones?</h3>
        <label>
          <input
            type="radio"
            value="rating"
            checked={preference === "rating"}
            onChange={() => setPreference("rating")}
          />
          Basado en calificación
        </label>
        <label>
          <input
            type="radio"
            value="popularity"
            checked={preference === "popularity"}
            onChange={() => setPreference("popularity")}
          />
          Basado en popularidad
        </label>
      </div>

      <button onClick={handleSubmit}>Guardar</button>
    </div>
  );
};

export default EditPreferences;