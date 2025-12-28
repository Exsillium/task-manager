const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Path to SQLite file
const dbPath = path.resolve(__dirname, "../database.sqlite");

// Create / connect to database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Failed to connect to database", err);
  } else {
    console.log("Connected to SQLite database");
  }
});

// Create tables if they don't exist
db.serialize(() => {
  // Users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tasks table
  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);
});


module.exports = db;
