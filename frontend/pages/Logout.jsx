import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Logout ({ userToken, logoutFunction }) {
  const navigate = useNavigate()

  useEffect(() => {
    if (!userToken?.id) {
      navigate('/')
    }
  }, [userToken])

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
        You have successfully authenticated!
      </Typography>
      <Button variant='contained' onClick={() => { logoutFunction(); navigate('/') }} sx={{ m: 1 }}>
        Logout
      </Button>
    </Box>
  )
}

export default Logout
