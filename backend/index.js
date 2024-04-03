const cors = require('cors')
const db = require('./db')
const morgan = require('morgan')
const express = require('express')
const fs = require('fs')
const https = require('https')
const multer = require('multer')
const path = require('path')
const { v4: uuidv4 } = require('uuid')

const speech = require('@google-cloud/speech')

const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path
const ffmpeg = require('fluent-ffmpeg')
ffmpeg.setFfmpegPath(ffmpegPath)

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

// Middleware for converting audio files
function convertAudio (req, res, next) {
  // Check if file is uploaded
  if (!req.file) {
    return next(new Error('No file uploaded with request.'))
  }

  // Determine paths
  const originalPath = req.file.path
  const targetFormat = 'wav'
  const targetPath = originalPath.replace(path.extname(originalPath), `.${targetFormat}`)

  ffmpeg(originalPath)
    .toFormat(targetFormat)
    .on('error', (err) => {
      console.error(`An error occurred during the conversion: ${err.message}`)
      return next(err)
    })
    .on('end', () => {
      req.file.path = targetPath
      req.file.originalname = req.file.originalname.replace(path.extname(req.file.originalname), `.${targetFormat}`)

      // Delete the original webm file
      fs.unlink(originalPath, (err) => {
        if (err) {
          console.error(`Failed to delete the original file: ${err}`)
          return next(err)
        }
      })

      next()
    })
    .save(targetPath)
}

// Logging incoming traffic for debugging purposes
app.use(morgan('dev'))

// Speech to text client
const client = new speech.SpeechClient()

async function transcribeSpeech (filepath) {
  const filename = filepath
  const encoding = 'Encoding of the audio file, e.g. LINEAR16'
  const languageCode = 'en-US'

  const config = {
    encoding,
    languageCode
  }

  const audio = {
    content: fs.readFileSync(filename).toString('base64')
  }

  const request = {
    config,
    audio
  }

  // Detects speech in the audio file
  const [response] = await client.recognize(request)
  return response.results
    .map(result => result.alternatives[0].transcript)
    .join('\n')
}

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

app.post('/register', upload.single('audio'), convertAudio, async (req, res) => {
  if (!req.file) {
    return res.status(400).send('Audio file is required.')
  }

  // TODO: salt and hash passwords
  const { username, password, phrase } = req.body
  const audioPath = req.file.path

  // Compare speech to text
  const transcript = (await transcribeSpeech(audioPath)).toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '')
  const testPhrase = phrase.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '')
  console.log(testPhrase,
    transcript,
    testPhrase === transcript
  )
  if (testPhrase !== transcript) {
    return res.status(403).send('Registration failed.')
  }

  // Attempt to insert user credentials into the database
  const insertUser = 'INSERT INTO users (username, password, audioPath) VALUES (?, ?, ?)'
  db.run(insertUser, [username, password, audioPath], function (err) {
    if (err) {
      fs.rm(audioPath, (rmErr) => {
        if (rmErr) {
          console.error(`Failed to delete audio file: ${audioPath}`, rmErr)
        } else {
          console.log(`DB error: ${err.message}. Cleaned up audio file.`)
        }
        return res.status(403).send('Registration failed.')
      })
    } else {
      res.status(201).send({ userId: this.lastID, message: 'User registered successfully!' })
    }
  })
})

app.post('/login', upload.single('audio'), convertAudio, async (req, res) => {
  if (!req.file) {
    return res.status(400).send('Audio file is required.')
  }

  const { username, password, phrase } = req.body
  const audioPath = req.file.path

  // Compare speech to text
  const transcript = (await transcribeSpeech(audioPath)).toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '')
  const testPhrase = phrase.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '')
  console.log(testPhrase,
    transcript,
    testPhrase === transcript
  )

  if (testPhrase !== transcript) {
    return res.status(403).send('Login failed.')
  }

  // Validate login and retrieve audioPath
  const retrieveUser = 'SELECT id, password, audioPath FROM users WHERE username=?'
  db.get(retrieveUser, [username], function (err, row) {
    if (err) {
      fs.rm(audioPath, (rmErr) => {
        if (rmErr) {
          console.error(`Failed to delete audio file: ${audioPath}`, rmErr)
          return res.status(500).send('Failed to clean up audio file.')
        }
        console.log(`DB error: ${err.message}. Cleaned up audio file.`)
        return res.status(403).send('Login failed.')
      })
    }

    // TODO: replace pwd check with hash/salt
    else if (!row || password !== row.password) {
      return res.status(403).send('Login failed.')
    }

    // Compare voice auth

    return res.status(200).send({ userId: row.id, message: 'User authenticated successfully!' })
  })
})

// Create an HTTPS server
https.createServer(sslOptions, app).listen(PORT, () => {
  console.log(`HTTPS server running on port ${PORT}`)
})
