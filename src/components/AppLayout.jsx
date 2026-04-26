import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

function AppLayout({ user, onLogout }) {
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Sidebar - Persistent on desktop, drawer on mobile */}
      <Sidebar 
        mobileOpen={mobileOpen} 
        onClose={handleDrawerToggle} 
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - 280px)` },
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Navbar 
          user={user} 
          onLogout={onLogout} 
          onMenuClick={handleDrawerToggle} 
        />

        {/* Page Content */}
        <Box sx={{ flexGrow: 1, p: { xs: 2, md: 0 } }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

export default AppLayout;
