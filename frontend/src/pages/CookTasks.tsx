import React, { useEffect, useState } from 'react';
import { Typography, Box, List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';

const CookTasks: React.FC = () => {
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    axios.get('/api/tasks').then(response => {
      setTasks(response.data);
    });
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Cook Tasks</Typography>
      <List>
        {tasks.map((task) => (
          <ListItem key={task.id}>
            <ListItemText primary={task.description} secondary={task.status} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default CookTasks;
