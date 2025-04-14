import React, { useEffect, useRef } from 'react';
import { Box, Typography, Button } from '@mui/material';
import adapter from 'webrtc-adapter';

const Telemedicine: React.FC = () => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const startVideo = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      // Implement WebRTC logic here
    };
    startVideo();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Telemedicine</Typography>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <video ref={localVideoRef} autoPlay playsInline style={{ width: '50%' }} />
        <video ref={remoteVideoRef} autoPlay playsInline style={{ width: '50%' }} />
      </Box>
      <Button variant="contained" sx={{ mt: 2 }}>Start Call</Button>
    </Box>
  );
};

export default Telemedicine;
