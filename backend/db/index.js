const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('./users.db')

try {
  db.serialize(function () {
    db.run(`CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL,
          audioPath TEXT NOT NULL
        )`)
  })
} catch (err) {
  if (err.message.search('already exists') === -1) {
    console.log('Failed to create users table.')
    console.log(err)
  }
}

module.exports = db
