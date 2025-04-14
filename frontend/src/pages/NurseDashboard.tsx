import React, { useEffect, useState } from 'react';
import { Typography, Box, Paper, List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';

const NurseDashboard: React.FC = () => {
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    axios.get('/api/tasks').then(response => {
      setTasks(response.data);
    });
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Nurse Dashboard</Typography>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6">Tasks</Typography>
        <List>
          {tasks.map((task) => (
            <ListItem key={task.id}>
              <ListItemText primary={task.description} secondary={task.status} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default NurseDashboard;
