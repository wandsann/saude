import React, { useEffect, useState } from 'react';
import { Typography, Box, Paper, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import axios from 'axios';

const PatientDashboard: React.FC = () => {
  const [appointments, setAppointments] = useState<any[]>([]);

  useEffect(() => {
    axios.get('/api/appointments').then(response => {
      setAppointments(response.data);
    });
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Patient Dashboard</Typography>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6">Upcoming Appointments</Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Doctor</TableCell>
              <TableCell>Hospital</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.map((appt) => (
              <TableRow key={appt.id}>
                <TableCell>{appt.date}</TableCell>
                <TableCell>{appt.doctor}</TableCell>
                <TableCell>{appt.hospital}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default PatientDashboard;
