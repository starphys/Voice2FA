import { useState } from 'react'
import { AudioRecorder } from 'react-audio-voice-recorder'
import { Box, Typography } from '@mui/material'
import './CustomAudioRecorder.css'

function CustomAudioRecorder ({ onRecordingComplete, phrase = 'The quick brown fox jumps over the lazy dog' }) {
  const [audioBlob, setAudioBlob] = useState(null)

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      margin: '20px 0'
    }}
    >
      <Typography sx={{
        marginBottom: '10px',
        textAlign: 'center'
      }}
      >
        Please press record and read the following:
        <br /><b>{phrase}</b><br />
        Press the save icon when you are finished.
      </Typography>
      <AudioRecorder
        onRecordingComplete={(blob) => {
          setAudioBlob(blob)
          onRecordingComplete(blob)
        }}
        audioTrackConstraints={{
          noiseSuppression: true,
          echoCancellation: true
        }}
        classes={{ AudioRecorderClass: `custom-recorder${audioBlob ? ' custom-recorder-saved' : ''}` }}
      />
    </Box>
  )
}

export default CustomAudioRecorder
