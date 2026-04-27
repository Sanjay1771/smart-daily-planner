import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Box,
  InputBase,
  Tooltip,
  ListItemIcon,
  Divider,
  Chip,
  useTheme as useMuiTheme,
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import { useTheme } from '../contexts/ThemeContext';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: 12,
  backgroundColor: theme.palette.mode === 'light' ? '#EBEBEB' : '#1C1C1E',
  transition: 'all 0.25s ease',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'light' ? '#E1E1E1' : '#2C2C2E',
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(4),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.text.secondary,
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1.2, 1.2, 1.2, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    width: '100%',
    fontSize: '0.9rem',
    fontWeight: 600,
    [theme.breakpoints.up('md')]: {
      width: '28ch',
    },
  },
}));

function Navbar({ pageTitle, user, onLogout, onMenuClick }) {
  const { theme: themeMode, setTheme } = useTheme();
  const muiTheme = useMuiTheme();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleToggleTheme = () => {
    setTheme(themeMode === 'light' ? 'dark' : 'light');
  };

  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '';

  return (
    <AppBar position="sticky" elevation={0}>
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 4 }, minHeight: { xs: 64, md: 74 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={onMenuClick}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuRoundedIcon />
          </IconButton>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ fontWeight: 800, color: 'text.primary', fontSize: '1rem', letterSpacing: '-0.02em' }}
            >
              {pageTitle}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: '6px', sm: '10px' } }}>
          <IconButton 
            onClick={handleToggleTheme} 
            color="inherit" 
            size="small" 
            sx={{ 
              width: 40, height: 40,
              color: themeMode === 'light' ? '#374151' : 'inherit',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': { 
                color: themeMode === 'light' ? '#111827' : 'inherit',
                transform: 'scale(1.1)',
                filter: 'drop-shadow(0 0 6px rgba(0,113,227,0.2))'
              }
            }}
          >
            {themeMode === 'light' ? <DarkModeRoundedIcon fontSize="small" /> : <LightModeRoundedIcon fontSize="small" />}
          </IconButton>

          <IconButton 
            color="inherit" 
            size="small" 
            className="notification-pulse"
            sx={{ 
              width: 40, height: 40,
              color: themeMode === 'light' ? '#374151' : 'inherit',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': { 
                color: themeMode === 'light' ? '#111827' : 'inherit',
                transform: 'scale(1.15)'
              }
            }}
          >
            <Badge variant="dot" color="primary" overlap="circular">
              <NotificationsNoneRoundedIcon fontSize="small" />
            </Badge>
          </IconButton>

          <Avatar 
            onClick={handleProfileMenuOpen}
            sx={{ 
              width: 40, 
              height: 40, 
              fontSize: '0.9rem', 
              fontWeight: 800,
              bgcolor: themeMode === 'light' ? 'white' : 'primary.main',
              color: themeMode === 'light' ? 'primary.main' : 'white',
              cursor: 'pointer',
              border: themeMode === 'light' ? '2px solid' : 'none',
              borderColor: 'primary.main',
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              ml: 0,
              '&:hover': { 
                transform: 'scale(1.08)',
                boxShadow: themeMode === 'light' 
                  ? '0 0 12px rgba(0,113,227,0.3)' 
                  : '0 0 12px rgba(10,132,255,0.4)'
              }
            }}
          >
            {initials}
          </Avatar>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            onClick={handleMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              elevation: 0,
              sx: {
                width: 240,
                mt: 1.5,
                borderRadius: '16px',
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                p: 1
              },
            }}
          >
            <Box sx={{ px: 2, py: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>{user?.name}</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5, fontWeight: 600 }}>{user?.email}</Typography>
            </Box>
            <Divider sx={{ my: 1, opacity: 0.5 }} />
            <MenuItem onClick={() => navigate('/profile')} sx={{ borderRadius: '10px', py: 1.2 }}>
              <ListItemIcon><PersonOutlineRoundedIcon fontSize="small" /></ListItemIcon>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>Profile Settings</Typography>
            </MenuItem>
            <MenuItem onClick={() => navigate('/settings')} sx={{ borderRadius: '10px', py: 1.2 }}>
              <ListItemIcon><SettingsRoundedIcon fontSize="small" /></ListItemIcon>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>Preferences</Typography>
            </MenuItem>
            <Divider sx={{ my: 1, opacity: 0.5 }} />
            <MenuItem onClick={onLogout} sx={{ color: 'error.main', borderRadius: '10px', py: 1.2 }}>
              <ListItemIcon><LogoutRoundedIcon fontSize="small" color="error" /></ListItemIcon>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>Sign Out</Typography>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
