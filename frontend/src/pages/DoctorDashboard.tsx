import React, { useEffect, useState } from 'react';
import { Typography, Box, Paper, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import axios from 'axios';

const DoctorDashboard: React.FC = () => {
  const [patients, setPatients] = useState<any[]>([]);

  useEffect(() => {
    axios.get('/api/patients').then(response => {
      setPatients(response.data);
    });
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Doctor Dashboard</Typography>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6">Patients</Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Age</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {patients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell>{patient.name}</TableCell>
                <TableCell>{patient.age}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default DoctorDashboard;
