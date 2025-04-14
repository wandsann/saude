import React from 'react';
import { Typography, Box, Paper } from '@mui/material';

const AdminDashboard: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6">Overview</Typography>
        <Typography>Manage users, view reports, and more.</Typography>
      </Paper>
    </Box>
  );
};

export default AdminDashboard;
