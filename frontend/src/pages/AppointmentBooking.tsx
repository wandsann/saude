import React, { useState } from 'react';
import { TextField, Button, Box, Typography, MenuItem } from '@mui/material';
import axios from 'axios';

const AppointmentBooking: React.FC = () => {
  const [doctorId, setDoctorId] = useState('');
  const [hospitalId, setHospitalId] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.post('/api/appointments', { doctorId, hospitalId, date });
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8, p: 2 }}>
      <Typography variant="h4" gutterBottom>Book Appointment</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Doctor ID"
          value={doctorId}
          onChange={(e) => setDoctorId(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Hospital ID"
          value={hospitalId}
          onChange={(e) => setHospitalId(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Date"
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          required
        />
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          Book
        </Button>
      </form>
    </Box>
  );
};

export default AppointmentBooking;
