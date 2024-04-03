import 'dotenv/config'

import speech from '@google-cloud/speech'

import axios from 'axios'
import cors from 'cors'
import dbPromise from './db/index.js'
import express from 'express'
import { path as ffmpegPath } from '@ffmpeg-installer/ffmpeg'
import ffmpeg from 'fluent-ffmpeg'
import FormData from 'form-data'
import fs from 'fs'
import https from 'https'
import path from 'path'
import morgan from 'morgan'
import multer from 'multer'
import { v4 as uuidv4 } from 'uuid'

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

async function verifyVoiceSignature (audioPath1, audioPath2) {
  const data = new FormData()
  data.append('sound1', fs.createReadStream(audioPath1))
  data.append('sound2', fs.createReadStream(audioPath2))

  const verificationUrl = 'https://speaker-verification1.p.rapidapi.com/Verification'

  try {
    console.log('Calling voice signature verification')
    const response = await axios.post(verificationUrl, data, {
      headers: {
        ...data.getHeaders(),
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'speaker-verification1.p.rapidapi.com'
      }
    })

    const result = response.data

    console.log(result, 'returning', result.data.resultIndex > 0)
    console.log(result.data)

    return result.data.resultIndex > 0
  } catch (error) {
    console.error(error.response ? error.response.data : error.message)
  }
}

const PORT = 3443

// SSL certificate paths
const sslOptions = {
  key: fs.readFileSync('certificate/key.pem'),
  cert: fs.readFileSync('certificate/cert.pem')
}

// Default route
app.get('/', (req, res) => {
  res.send('Hello, HTTPS world!')
})

app.post('/register', upload.single('audio'), convertAudio, async (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: 'Audio file is required.' })
  }

  // TODO: salt and hash passwords
  const { username, password, phrase } = req.body
  const audioPath = req.file.path

  // Compare speech to text
  const transcript = (await transcribeSpeech(audioPath)).toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '')
  const testPhrase = phrase.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '')
  console.log(transcript, testPhrase, transcript === testPhrase)
  if (testPhrase !== transcript) {
    return res.status(403).send({ message: 'Registration failed.' })
  }

  // Attempt to insert user credentials into the database
  const insertUser = 'INSERT INTO users (username, password, audioPath) VALUES (?, ?, ?)'
  try {
    const db = await dbPromise
    const result = await db.run(insertUser, [username, password, audioPath])
    return res.status(201).send({ userId: result.lastID, message: 'User registered successfully!' })
  } catch (err) {
    console.error(`Failed to insert user: ${err}`)

    try {
      await fs.promises.rm(audioPath)
      return res.status(403).send({ message: 'Registration failed.' })
    } catch (rmErr) {
      console.error(`Failed to delete audio file: ${audioPath}`, rmErr)
      return res.status(500).send({ message: 'Internal server error' })
    }
  }
})

app.post('/login', upload.single('audio'), convertAudio, async (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: 'Audio file is required.' })
  }

  const { username, password, phrase } = req.body
  const audioPath = req.file.path

  // Compare speech to text
  const transcript = (await transcribeSpeech(audioPath)).toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '')
  const testPhrase = phrase.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '')
  console.log(transcript, testPhrase, transcript === testPhrase)

  if (testPhrase !== transcript) {
    return res.status(403).send({ message: 'Login failed.' })
  }

  // Validate login and retrieve audioPath
  const retrieveUser = 'SELECT id, password, audioPath FROM users WHERE username=?'
  try {
    const db = await dbPromise
    const user = await db.get(retrieveUser, username)

    // TODO: replace pwd check with hash/salt

    // Compare voice auth
    if (user && password === user.password && (await verifyVoiceSignature(user.audioPath, audioPath))) {
      return res.status(200).send({ userId: user.id, message: 'User authenticated successfully!' })
    }

    return res.status(403).send({ message: 'Login failed.' })
  } catch (err) {
    console.error(`Login error: ${err}`)
    res.status(500).send({ message: 'Internal server error' })
  }
})

// Create an HTTPS server
https.createServer(sslOptions, app).listen(PORT, () => {
  console.log(`HTTPS server running on port ${PORT}`)
})
