import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Header: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          {t('appTitle')}
        </Typography>
        <IconButton color="inherit" onClick={handleMenu}>
          <AccountCircle />
        </IconButton>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
          <MenuItem onClick={() => { handleClose(); navigate('/profile'); }}>{t('profile')}</MenuItem>
          <MenuItem onClick={() => { handleClose(); navigate('/settings'); }}>{t('settings')}</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
