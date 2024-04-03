import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// MUI
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import CustomAudioRecorder from '../component/CustomAudioRecorder'

function UserAuth ({
  title = 'Register',
  endpoint = 'register',
  actionString = 'Registration',
  phrase = 'Keep your face always toward the sunshine, and shadows will fall behind you.',
  loginFunction = () => {}
}) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [audioBlob, setAudioBlob] = useState(null)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Basic form validation
    if (!username || !password || !audioBlob) {
      alert('Please fill in all fields and record your voice.')
      return
    }

    // Preparing the FormData
    const formData = new FormData()
    formData.append('username', username)
    formData.append('password', password)
    formData.append('phrase', phrase)
    formData.append('audio', audioBlob, `${username}-audioBlob.webm`)

    // Send account data to the server
    try {
      const response = await fetch(`https://localhost:3443/${endpoint}`, {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const result = await response.json()
        console.log(result)
        loginFunction(result.userId ?? 1)
        navigate('/logout')
      } else {
        const errorResult = await response.json()
        console.error(`${actionString} failed:`, errorResult)
        alert(`${actionString} failed. Please try again.`)
      }
    } catch (error) {
      console.error('Network error:', error)
      alert('Network error. Please check your connection and try again.')
    }
  }

  return (
    <Container component='main' maxWidth='xs'>
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Typography component='h1' variant='h5'>
          {title}
        </Typography>
        <Box component='form' onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin='normal'
            required
            fullWidth
            id='username'
            label='Username'
            name='username'
            autoComplete='username'
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin='normal'
            required
            fullWidth
            name='password'
            label='Password'
            type='password'
            id='password'
            autoComplete='current-password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <CustomAudioRecorder
            onRecordingComplete={setAudioBlob}
            phrase={phrase}
          />
          <Button
            type='submit'
            fullWidth
            variant='contained'
            sx={{ mt: 3, mb: 2 }}
          >
            {title}
          </Button>
        </Box>
      </Box>
    </Container>
  )
}

export default UserAuth
