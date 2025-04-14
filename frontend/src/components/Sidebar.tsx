import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { Dashboard, People, Event, CleaningServices, Kitchen, AdminPanelSettings, ExitToApp } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { t } = useTranslation();

  const menuItems = user?.role === 'paciente' ? [
    { text: t('dashboard'), icon: <Dashboard />, path: '/patient-dashboard' },
    { text: t('appointments'), icon: <Event />, path: '/appointment-booking' },
    { text: t('medicalRecords'), icon: <People />, path: '/medical-records' },
  ] : user?.role === 'medico' ? [
    { text: t('dashboard'), icon: <Dashboard />, path: '/doctor-dashboard' },
    { text: t('patients'), icon: <People />, path: '/patients' },
    { text: t('reports'), icon: <Event />, path: '/doctor-reports' },
  ] : user?.role === 'enfermeiro' ? [
    { text: t('dashboard'), icon: <Dashboard />, path: '/nurse-dashboard' },
    { text: t('patients'), icon: <People />, path: '/patients' },
  ] : user?.role === 'faxineiro' ? [
    { text: t('dashboard'), icon: <Dashboard />, path: '/cleaner-dashboard' },
    { text: t('tasks'), icon: <CleaningServices />, path: '/cleaner-tasks' },
  ] : user?.role === 'cozinheiro' ? [
    { text: t('dashboard'), icon: <Dashboard />, path: '/cook-dashboard' },
    { text: t('tasks'), icon: <Kitchen />, path: '/cook-tasks' },
  ] : user?.role === 'admin' ? [
    { text: t('dashboard'), icon: <Dashboard />, path: '/admin-dashboard' },
    { text: t('registerDoctor'), icon: <People />, path: '/doctor-register' },
    { text: t('registerNurse'), icon: <People />, path: '/nurse-register' },
    { text: t('reports'), icon: <AdminPanelSettings />, path: '/admin-reports' },
  ] : [];

  return (
    <Drawer variant="permanent" sx={{ width: 240, flexShrink: 0, '& .MuiDrawer-paper': { width: 240, boxSizing: 'border-box' } }}>
      <List>
        {menuItems.map((item) => (
          <ListItem button key={item.text} onClick={() => navigate(item.path)}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem button onClick={logout}>
          <ListItemIcon><ExitToApp /></ListItemIcon>
          <ListItemText primary={t('logout')} />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
