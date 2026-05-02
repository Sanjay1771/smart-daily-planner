import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Divider,
  useTheme as useMuiTheme,
  useMediaQuery,
  alpha,
} from '@mui/material';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import TodayRoundedIcon from '@mui/icons-material/TodayRounded';
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';

const DRAWER_WIDTH = 260;

function Sidebar({ isOpen, setIsOpen, user }) {
  const location = useLocation();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: <DashboardRoundedIcon sx={{ fontSize: 20 }} /> },
    { label: 'Today', path: '/today', icon: <TodayRoundedIcon sx={{ fontSize: 20 }} /> },
    { label: 'Upcoming', path: '/upcoming', icon: <EventAvailableRoundedIcon sx={{ fontSize: 20 }} /> },
    { label: 'Calendar', path: '/calendar', icon: <CalendarMonthRoundedIcon sx={{ fontSize: 20 }} /> },

    { label: 'Completed', path: '/completed', icon: <BoltRoundedIcon sx={{ fontSize: 20 }} /> },
  ];

  const bottomItems = [
    { label: 'Profile', path: '/profile', icon: <PersonRoundedIcon sx={{ fontSize: 20 }} /> },
    { label: 'Settings', path: '/settings', icon: <SettingsRoundedIcon sx={{ fontSize: 20 }} /> },
  ];

  const renderNavItem = (item) => {
    const isActive = location.pathname === item.path;

    return (
      <ListItem key={item.label} disablePadding sx={{ px: 1, mb: 0.5 }}>
        <ListItemButton
          component={NavLink}
          to={item.path}
          onClick={() => isMobile && setIsOpen(false)}
          selected={isActive}
          sx={{
            minHeight: 46,
            px: 2,
            borderRadius: '10px',
            color: isActive ? 'primary.main' : 'text.secondary',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '&.Mui-selected': {
              bgcolor: alpha(muiTheme.palette.primary.main, 0.1),
              color: 'primary.main',
              '&:hover': { bgcolor: alpha(muiTheme.palette.primary.main, 0.15) },
              '& .MuiListItemIcon-root': { color: 'primary.main' },
            },
            '&:hover': {
              bgcolor: alpha(muiTheme.palette.text.primary, 0.04),
              transform: 'translateX(6px)',
              '& .MuiListItemIcon-root': { color: 'primary.main', filter: 'drop-shadow(0 0 4px rgba(0,113,227,0.3))' },
            }
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: 2,
              color: isActive ? 'primary.main' : 'text.secondary',
              transition: 'color 0.2s',
            }}
          >
            {item.icon}
          </ListItemIcon>
          <ListItemText 
            primary={item.label} 
            sx={{ 
              '& .MuiListItemText-primary': {
                fontSize: '0.9rem',
                fontWeight: isActive ? 700 : 600,
                letterSpacing: '-0.01em'
              }
            }} 
          />
        </ListItemButton>
      </ListItem>
    );
  };

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', py: 3 }}>
      {/* Brand Branding */}
      <Box sx={{ px: 4, mb: 6, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box
          sx={{
            width: 32,
            height: 32,
            bgcolor: 'primary.main',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <BoltRoundedIcon sx={{ color: 'white', fontSize: 20 }} />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.1rem', color: 'text.primary', letterSpacing: '-0.04em' }}>
          PlanPro
        </Typography>
      </Box>

      <List sx={{ flexGrow: 1 }}>
        {navItems.map(renderNavItem)}
      </List>

      <Divider sx={{ mx: 3, my: 3, opacity: 0.5 }} />

      <List sx={{ pb: 2 }}>
        {bottomItems.map(renderNavItem)}
      </List>
      
      {/* Footer Branding */}
      <Box sx={{ px: 4, py: 2 }}>
         <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
           v1.2.0 · Professional Edition
         </Typography>
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
    >
      <Drawer
        variant="temporary"
        open={isOpen}
        onClose={() => setIsOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: DRAWER_WIDTH,
            borderRight: 'none',
          },
        }}
      >
        {drawerContent}
      </Drawer>

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: DRAWER_WIDTH,
            borderRight: `1px solid ${muiTheme.palette.divider}`,
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}

export default Sidebar;
