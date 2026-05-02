import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider as CustomThemeProvider, useTheme } from './contexts/ThemeContext';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, CircularProgress } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import getDesignTokens from './theme';
import AppLayout from './components/AppLayout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Today from './pages/Today';
import Upcoming from './pages/Upcoming';
import CalendarPage from './pages/CalendarPage';

import Completed from './pages/Completed';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import { supabase } from './supabaseClient';

// Premium Page Transition Wrapper
const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, x: 10 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -10 }}
    transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
    className="page-transition-container"
  >
    {children}
  </motion.div>
);

function AppContent() {
  const { isDark } = useTheme();
  const location = useLocation();
  
  const theme = useMemo(() => 
    createTheme(getDesignTokens(isDark ? 'dark' : 'light')), 
    [isDark]
  );

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleUser = (sessionUser) => {
      if (sessionUser) {
        sessionUser.name = sessionUser.user_metadata?.name || sessionUser.email;
        setUser(sessionUser);
      } else {
        setUser(null);
      }
    };

    const checkInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        handleUser(session?.user);
      } catch (error) {
        console.error('Session check failed:', error.message);
      } finally {
        setLoading(false);
      }
    };

    checkInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      handleUser(session?.user);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: isDark ? '#000' : '#F5F5F7' }}>
        <CircularProgress size={40} thickness={4} />
      </Box>
    );
  }

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/login"
            element={user ? <Navigate to="/dashboard" replace /> : <PageTransition><Login /></PageTransition>}
          />
          <Route
            path="/signup"
            element={<PageTransition><Signup /></PageTransition>}
          />

          <Route
            element={
              user ? <AppLayout user={user} onLogout={handleLogout} /> : <Navigate to="/login" replace />
            }
          >
            <Route path="/dashboard" element={<PageTransition><Dashboard user={user} /></PageTransition>} />
            <Route path="/today" element={<PageTransition><Today user={user} /></PageTransition>} />
            <Route path="/upcoming" element={<PageTransition><Upcoming user={user} /></PageTransition>} />
            <Route path="/calendar" element={<PageTransition><CalendarPage user={user} /></PageTransition>} />

            <Route path="/completed" element={<PageTransition><Completed user={user} /></PageTransition>} />
            <Route path="/settings" element={<PageTransition><Settings user={user} /></PageTransition>} />
            <Route path="/profile" element={<PageTransition><Profile user={user} /></PageTransition>} />
          </Route>

          <Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
        </Routes>
      </AnimatePresence>
    </MuiThemeProvider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <CustomThemeProvider>
        <AppContent />
      </CustomThemeProvider>
    </BrowserRouter>
  );
}

export default App;
