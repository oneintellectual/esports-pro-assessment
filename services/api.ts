import { ScoreRecord, User } from '../types';

// In a real app, these would be Axios/Fetch calls to the Express/MongoDB backend
// Current implementation mimics the DB behavior in memory/localStorage

const STORAGE_KEY = 'esports_eval_data';

interface DB {
  user: User | null;
  scores: ScoreRecord[];
}

const getDB = (): DB => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : { user: null, scores: [] };
};

const saveDB = (db: DB) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
};

export const api = {
  createUser: async (username: string): Promise<User> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user: User = { username, startedAt: Date.now() };
    const db = getDB();
    db.user = user;
    db.scores = []; // Reset scores for new run
    saveDB(db);
    return user;
  },

  submitScore: async (record: ScoreRecord): Promise<void> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const db = getDB();
    db.scores.push(record);
    saveDB(db);
  },

  getAllScores: async (): Promise<ScoreRecord[]> => {
    await new Promise(resolve => setTimeout(resolve, 800)); // Longer delay for "Analysis"
    const db = getDB();
    return db.scores;
  }
};