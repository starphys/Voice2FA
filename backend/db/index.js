import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

// Open a database connection
async function openDB () {
  return open({
    filename: './users.db',
    driver: sqlite3.Database
  })
}

async function initializeDB () {
  const db = await openDB()
  try {
    await db.exec(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        audioPath TEXT NOT NULL
      )`)
  } catch (err) {
    if (!err.message.includes('already exists')) {
      console.log('Failed to create users table.')
      console.log(err)
    }
  }
  return db
}

const dbPromise = initializeDB()

export default dbPromise
