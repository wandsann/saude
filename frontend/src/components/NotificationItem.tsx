import React from 'react';
import { ListItem, ListItemText } from '@mui/material';

interface NotificationItemProps {
  message: string;
  type: string;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ message, type }) => {
  return (
    <ListItem>
      <ListItemText primary={message} secondary={type} />
    </ListItem>
  );
};

export default NotificationItem;
