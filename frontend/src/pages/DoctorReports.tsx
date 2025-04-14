import React from 'react';
import { Typography, Box, Paper } from '@mui/material';

const DoctorReports: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Doctor Reports</Typography>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6">Attendance Metrics</Typography>
        <Typography>Placeholder for charts and metrics.</Typography>
      </Paper>
    </Box>
  );
};

export default DoctorReports;
