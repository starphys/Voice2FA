const cors = require('cors')
const db = require('./db')
const express = require('express')
const fs = require('fs')
const https = require('https')
const multer = require('multer')
const path = require('path')
const { v4: uuidv4 } = require('uuid')

const app = express()

// Allow cross-site requests
app.use(cors())

// Extract parameters into attached object
app.use(express.json())

// File storage strategy for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'audio/')
  },
  filename: function (req, file, cb) {
    const uniqueFilename = uuidv4() + path.extname(file.originalname)
    cb(null, uniqueFilename)
  }
})

const upload = multer({ storage })

const PORT = 3443

// SSL certificate paths
const sslOptions = {
  key: fs.readFileSync(path.join(__dirname, 'certificate/key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'certificate/cert.pem'))
}

// Default route
app.get('/', (req, res) => {
  res.send('Hello, HTTPS world!')
})

app.post('/register', upload.single('audio'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('Audio file is required.')
  }

  const { username, password } = req.body
  const audioPath = req.file.path // Path where the audio file is saved

  // Attempt to insert user credentials into the database
  const insertUser = 'INSERT INTO users (username, password, audioPath) VALUES (?, ?, ?)'
  db.run(insertUser, [username, password, audioPath], function (err) {
    if (err) {
      fs.rm(audioPath, (rmErr) => {
        if (rmErr) {
          console.error(`Failed to delete audio file: ${audioPath}`, rmErr)
          return res.status(500).send('Failed to clean up audio file.')
        }
        console.log(`Duplicate username or DB error: ${err.message}. Cleaned up audio file.`)
        return res.status(409).send('Username already taken or registration failed.')
      })
    } else {
      res.status(201).send({ userId: this.lastID, message: 'User registered successfully!' })
    }
  })
})

// Create an HTTPS server
https.createServer(sslOptions, app).listen(PORT, () => {
  console.log(`HTTPS server running on port ${PORT}`)
})
