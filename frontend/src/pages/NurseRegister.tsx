import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import axios from 'axios';

const NurseRegister: React.FC = () => {
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.post('/api/nurses', { name });
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8, p: 2 }}>
      <Typography variant="h4" gutterBottom>Register Nurse</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
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

export default NurseRegister;
