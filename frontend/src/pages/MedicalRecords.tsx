import React, { useEffect, useState } from 'react';
import { Typography, Box, Paper, List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';

const MedicalRecords: React.FC = () => {
  const [records, setRecords] = useState<any[]>([]);

  useEffect(() => {
    axios.get('/api/medical-records').then(response => {
      setRecords(response.data);
    });
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Medical Records</Typography>
      <Paper sx={{ p: 2 }}>
        <List>
          {records.map((record) => (
            <ListItem key={record.id}>
              <ListItemText primary={record.exam_results} secondary={record.history} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default MedicalRecords;
