import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  CircularProgress,
  Stack,
  alpha,
  useTheme,
} from '@mui/material';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import CalendarModule from '../components/calendar/CalendarModule';
import { supabase } from '../supabaseClient';

function CalendarPage({ user }) {
  const muiTheme = useTheme();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllTasks = useCallback(async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      // Normalize data for CalendarModule
      const normalized = (data || []).map(row => ({
        ...row,
        date: row.event_date,
        time: row.start_time,
      }));
      setTasks(normalized);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchAllTasks();
  }, [fetchAllTasks]);

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <CircularProgress size={32} thickness={4} />
    </Box>
  );

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 }, px: { xs: 1.5, md: 3 } }}>
      <Stack spacing={3}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', pt: { xs: 0, md: 1 } }}>
          <Box sx={{ p: 1.5, bgcolor: 'primary.main', color: 'white', borderRadius: '14px', display: 'flex' }}>
             <CalendarMonthRoundedIcon />
          </Box>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: '-0.04em', fontSize: { xs: '1.5rem', md: '1.75rem' } }}>Master Schedule</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: { xs: '0.8rem', md: '0.85rem' } }}>Visual workspace timeline and event management.</Typography>
          </Box>
        </Box>

        <Paper elevation={0} sx={{ 
          p: { xs: 1, md: 1.5 }, 
          borderRadius: 0, 
          border: 'none', 
          overflow: 'visible',
          bgcolor: 'transparent',
          backgroundImage: 'none',
          boxShadow: 'none'
        }}>
          <CalendarModule 
            tasks={tasks} 
            setTasks={setTasks} 
            user={user} 
            onRefresh={fetchAllTasks} 
          />
        </Paper>
      </Stack>
    </Container>
  );
}

export default CalendarPage;
