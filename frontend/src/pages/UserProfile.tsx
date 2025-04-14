import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';

const UserProfile: React.FC = () => {
  const [name, setName] = useState('User Name');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Update profile logic
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8, p: 2 }}>
      <Typography variant="h4" gutterBottom>Profile</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          Update
        </Button>
      </form>
    </Box>
  );
};

export default UserProfile;
