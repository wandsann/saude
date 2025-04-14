import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import axios from 'axios';

const PatientRegister: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.post('/api/auth/register', { name, email, password, role: 'paciente', age });
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8, p: 2 }}>
      <Typography variant="h4" gutterBottom>Register Patient</Typography>
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
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Age"
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
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

export default PatientRegister;
