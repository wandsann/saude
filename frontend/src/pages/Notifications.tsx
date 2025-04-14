import React, { useEffect, useState } from 'react';
import { Typography, Box, List } from '@mui/material';
import axios from 'axios';
import NotificationItem from '../components/NotificationItem';

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    axios.get('/api/notifications').then(response => {
      setNotifications(response.data);
    });
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Notifications</Typography>
      <List>
        {notifications.map((notif) => (
          <NotificationItem key={notif.id} message={notif.message} type={notif.type} />
        ))}
      </List>
    </Box>
  );
};

export default Notifications;
