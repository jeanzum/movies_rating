import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import OnBoarding from './components/Onboarding';
import MovieList from "./pages/MovieList";
import EditPreferences from "./pages/EditPreferences";
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

  return (
    <Router>
      <div className="app-container">
        <nav>
          <Link to="/">Inicio</Link>
          <Link to="/edit-preferences">Editar Preferencias</Link>
        </nav>
        <Routes>
          <Route path="/" element={preferences ? <MovieList preferences={preferences} /> : <OnBoarding onComplete={setPreferences} />} />
          <Route path="/edit-preferences" element={<EditPreferences onComplete={setPreferences} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
