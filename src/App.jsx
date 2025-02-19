import { useState, useEffect } from 'react';
import OnBoarding from './components/Onboarding';
import MovieList from "./pages/MovieList";
import { getUserPreferences } from './db/indexedDB';

import './App.css';

function App() {
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { 
    const fetchPreferences = async () => {
      const storedPreferences = await getUserPreferences();
      console.log(storedPreferences);
      if (storedPreferences && Object.keys(storedPreferences).length > 0) {
        setPreferences(storedPreferences);
      }
      setLoading(false);
    };
    fetchPreferences();
  }, []);

  if (loading) return <p>Cargando...</p>;

  return preferences ? (
    <MovieList preferences={preferences} />
  ) : (
    <OnBoarding onComplete={setPreferences} />
  );
}

export default App;
