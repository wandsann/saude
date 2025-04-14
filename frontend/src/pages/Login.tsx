import React, { useState } from 'react';
import { TextField, Button, MenuItem, Box, Typography } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('paciente');
  const { login } = useAuth();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8, p: 2 }}>
      <Typography variant="h4" gutterBottom>Login</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          select
          label="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          fullWidth
          margin="normal"
        >
          <MenuItem value="paciente">Paciente</MenuItem>
          <MenuItem value="medico">Médico</MenuItem>
          <MenuItem value="enfermeiro">Enfermeiro</MenuItem>
          <MenuItem value="faxineiro">Faxineiro</MenuItem>
          <MenuItem value="cozinheiro">Cozinheiro</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
        </TextField>
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          {t('login')}
        </Button>
      </form>
    </Box>
  );
};

export default Login;
