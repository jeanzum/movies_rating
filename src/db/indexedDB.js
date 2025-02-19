import { openDB } from "idb";

const DB_NAME = "moviePreferencesDB";
const STORE_PREFERENCES = "preferences";
const STORE_USER = "userData";
const initDB = async () => {
    return openDB(DB_NAME, 1, {
        upgrade(db) {
            if(!db.objectStoreNames.contains(STORE_PREFERENCES)) 
                db.createObjectStore(STORE_PREFERENCES);
            if(!db.objectStoreNames.contains(STORE_USER))
                db.createObjectStore(STORE_USER);
        }
        
    });
};

export const setPreference = async (movieId, status) => {
    const db = await initDB();
    await db.put(STORE_PREFERENCES, status, movieId);
};

export const getPreferences = async () => {
    const db = await initDB();
    const keys = await db.getAllKeys(STORE_PREFERENCES);
    
    const preferences = {};
    for (const key of keys) {
        preferences[key] = await db.get(STORE_PREFERENCES, key);
    }

    return preferences;
};
export const setUserPreferences  = async (preferences) => {
    const db = await initDB();
    await db.put(STORE_USER, preferences, "userSettings");
};

export const getUserPreferences = async () => {
    const db = await initDB();
    return (await db.get(STORE_USER, "userSettings")) || {};
  };

  export const addWatchedMovie = async (movieId) => {
    const db = await initDB();
    const userSettings = (await db.get(STORE_USER, "userSettings")) || {};
    const watchedMovies = userSettings.watchedMovies || [];

    if (!watchedMovies.includes(movieId)) {
        watchedMovies.push(movieId);
        userSettings.watchedMovies = watchedMovies;
        await db.put(STORE_USER, userSettings, "userSettings");
    }
};
