import React from 'react';
import { Box, Typography, TextField, MenuItem } from '@mui/material';
import { useTranslation } from 'react-i18next';

const Settings: React.FC = () => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    i18n.changeLanguage(event.target.value);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Settings</Typography>
      <TextField
        select
        label="Language"
        value={i18n.language}
        onChange={handleLanguageChange}
        fullWidth
        margin="normal"
      >
        <MenuItem value="en">English</MenuItem>
        <MenuItem value="pt">Português</MenuItem>
        <MenuItem value="es">Español</MenuItem>
      </TextField>
    </Box>
  );
};

export default Settings;
