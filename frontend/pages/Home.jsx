import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { useNavigate } from 'react-router-dom'

function Home () {
  const navigate = useNavigate()

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        // backgroundImage: 'url()',
        backgroundSize: 'cover'
      }}
    >
      <Typography variant='h2' component='h1' gutterBottom>
        Welcome to Voice2FA User Interface
      </Typography>
      <Button variant='contained' endIcon={<SendIcon />} onClick={() => navigate('/register')} sx={{ m: 1 }}>
        Register
      </Button>
      <Button variant='contained' endIcon ={<SendIcon />} onClick={() => navigate('/login')} sx={{ m: 1 }}>
        Login
      </Button>
    </Box>
  )
}

export default Home
