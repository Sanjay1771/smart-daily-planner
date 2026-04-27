import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Container,
  Stack,
  Paper,
  Grid,
  CircularProgress,
  alpha,
  useTheme,
} from '@mui/material';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import TaskList from '../components/TaskList';
import { supabase } from '../supabaseClient';

function Completed({ user }) {
  const muiTheme = useTheme();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCompletedTasks = useCallback(async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('user_id', user.id)
        .eq('completed', true)
        .order('event_date', { ascending: false });
      
      if (error) throw error;
      setTasks(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchCompletedTasks();
  }, [fetchCompletedTasks]);

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 6 } }}>
      <Stack spacing={6} sx={{ textAlign: 'center', alignItems: 'center' }}>
        <Box>
          <Box sx={{ 
            width: { xs: 60, md: 80 }, 
            height: { xs: 60, md: 80 }, 
            bgcolor: alpha(muiTheme.palette.success.main, 0.1), 
            color: 'success.main', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            mb: 3,
            mx: 'auto'
          }}>
            <EmojiEventsRoundedIcon sx={{ fontSize: { xs: 30, md: 40 } }} />
          </Box>
          <Typography variant="h3" sx={{ fontWeight: 900, mb: 1, letterSpacing: '-0.04em', fontSize: { xs: '1.75rem', sm: '2rem', md: '3rem' } }}>Victory Lap</Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 600 }}>Celebrate your completed milestones and wins.</Typography>
        </Box>

        <Grid container spacing={{ xs: 2, md: 4 }} sx={{ maxWidth: { xs: '100%', md: 800 } }}>
           <Grid item xs={12} sm={6}>
              <Paper elevation={0} sx={{ p: 4, borderRadius: '24px', border: '1px solid', borderColor: 'divider' }}>
                 <CheckCircleRoundedIcon sx={{ fontSize: 32, color: 'success.main', mb: 2 }} />
                 <Typography variant="h4" sx={{ fontWeight: 900 }}>{tasks.length}</Typography>
                 <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary' }}>Completed Missions</Typography>
              </Paper>
           </Grid>
           <Grid item xs={12} sm={6}>
              <Paper elevation={0} sx={{ p: 4, borderRadius: '24px', border: '1px solid', borderColor: 'divider' }}>
                 <Typography variant="h4" sx={{ fontWeight: 900, color: 'primary.main' }}>100%</Typography>
                 <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary' }}>Success Velocity</Typography>
              </Paper>
           </Grid>
        </Grid>

        <Box sx={{ width: '100%', textAlign: 'left' }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 800 }}>Completed Projects</Typography>
          <TaskList 
            tasks={tasks} 
            view="Completed" 
            onRefresh={fetchCompletedTasks}
          />
        </Box>
      </Stack>
    </Container>
  );
}

export default Completed;
