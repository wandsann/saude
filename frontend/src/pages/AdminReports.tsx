import React from 'react';
import { Typography, Box, Paper } from '@mui/material';

const AdminReports: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Admin Reports</Typography>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6">Hospital Overview</Typography>
        <Typography>Placeholder for charts and metrics.</Typography>
      </Paper>
    </Box>
  );
};

export default AdminReports;
