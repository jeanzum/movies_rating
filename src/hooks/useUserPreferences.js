import { useEffect, useState } from "react";
import { setPreference, getPreferences } from "../db/indexedDB";

const useUserPreferences = () => {
  const [preferences, setPreferences] = useState({});

  useEffect(() => {
   const loadPreferences = async () => {
     const storedPreferences = await getPreferences();
     setPreferences(storedPreferences);
   };

   loadPreferences();
  }, []);

  const updatePreferences = async (movieId, status) => {
    await setPreference(movieId, status);
    setPreferences((prev) => ({
      ...prev,
      [movieId]: status,
    }));
  };
  return { preferences, updatePreferences };
};

export default useUserPreferences;
