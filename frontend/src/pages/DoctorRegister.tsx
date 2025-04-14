import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import axios from 'axios';

const DoctorRegister: React.FC = () => {
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.post('/api/doctors', { name, specialty });
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8, p: 2 }}>
      <Typography variant="h4" gutterBottom>Register Doctor</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Specialty"
          value={specialty}
          onChange={(e) => setSpecialty(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          Register
        </Button>
      </form>
    </Box>
  );
};

export default DoctorRegister;
