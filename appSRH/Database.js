import * as SQLite from 'expo-sqlite';

let db;

export const initDatabase = async () => {
  db = await SQLite.openDatabaseAsync('auth.db');

  await db.execAsync(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      password TEXT NOT NULL
    );`);

  const existing = await db.getFirstAsync(
    'SELECT * FROM users WHERE username = ?',
    ['admin']
  );

  if (!existing) {
    await db.runAsync(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      ['admin', 'admin']
    );
    console.log('Default admin created.');
  } else {
    console.log('Admin already exists.');
  }
};

export const insertUser = async (username, password) => {
  return db.runAsync(
    'INSERT INTO users (username, password) VALUES (?, ?)',
    [username, password]
  );
};

export const authenticateUser = async (username, password) => {
  const user = await db.getFirstAsync(
    'SELECT * FROM users WHERE username = ? AND password = ?',
    [username, password]
  );

  return !!user;
};
