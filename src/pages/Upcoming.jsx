import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Container,
  Stack,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  alpha,
  useTheme,
  LinearProgress,
  Divider,
} from '@mui/material';
import EventRepeatRoundedIcon from '@mui/icons-material/EventRepeatRounded';
import TimerRoundedIcon from '@mui/icons-material/TimerRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import TaskList from '../components/TaskList';
import { supabase } from '../supabaseClient';

function Upcoming({ user }) {
  const muiTheme = useTheme();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUpcomingTasks = useCallback(async () => {
    if (!user?.id) return;
    const today = new Date().toISOString().split('T')[0];
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('user_id', user.id)
        .gt('event_date', today)
        .order('event_date', { ascending: true });
      
      if (error) throw error;
      setTasks(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchUpcomingTasks();
  }, [fetchUpcomingTasks]);

  // Group tasks by date
  const groupedTasks = tasks.reduce((acc, task) => {
    const date = task.event_date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(task);
    return acc;
  }, {});

  const dates = Object.keys(groupedTasks);

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Stack spacing={6}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: '-0.04em' }}>Upcoming Roadmap</Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 600 }}>Plan your future with precision.</Typography>
        </Box>

        {/* Weekly Stats Header */}
        <Grid container spacing={3}>
           <Grid item xs={12} sm={4}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: '20px', border: '1px solid', borderColor: 'divider', bgcolor: alpha(muiTheme.palette.secondary.main, 0.05) }}>
                 <Stack direction="row" spacing={2} alignItems="center">
                    <Box sx={{ p: 1.5, bgcolor: 'secondary.main', color: 'white', borderRadius: '12px' }}>
                       <TimerRoundedIcon />
                    </Box>
                    <Box>
                       <Typography variant="h5" sx={{ fontWeight: 900 }}>{tasks.length}</Typography>
                       <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>Future Tasks</Typography>
                    </Box>
                 </Stack>
              </Paper>
           </Grid>
           <Grid item xs={12} sm={8}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: '20px', border: '1px solid', borderColor: 'divider' }}>
                 <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5 }}>Workspace Density (Next 7 Days)</Typography>
                 <LinearProgress variant="determinate" value={Math.min(tasks.length * 10, 100)} sx={{ height: 10, borderRadius: 5 }} />
              </Paper>
           </Grid>
        </Grid>

        {/* Future Planner Grid */}
        <Box>
          <Typography variant="h6" sx={{ mb: 4, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <CalendarMonthRoundedIcon color="primary" /> Future Planner
          </Typography>
          
          <Stack spacing={5}>
            {dates.length > 0 ? (
              dates.map(date => (
                <Box key={date}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2.5 }}>
                    <Chip 
                      label={new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} 
                      sx={{ fontWeight: 900, bgcolor: 'text.primary', color: 'background.paper', borderRadius: '8px' }} 
                    />
                    <Divider sx={{ flexGrow: 1, opacity: 0.5 }} />
                  </Box>
                  <TaskList tasks={groupedTasks[date]} view="Upcoming" onRefresh={fetchUpcomingTasks} />
                </Box>
              ))
            ) : (
              <Paper variant="outlined" sx={{ p: 8, textAlign: 'center', borderRadius: '24px', borderStyle: 'dashed' }}>
                <EventRepeatRoundedIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.secondary' }}>Your future is clear</Typography>
                <Typography variant="body2" sx={{ color: 'text.disabled' }}>Add new tasks from the dashboard to see your roadmap.</Typography>
              </Paper>
            )}
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
}

export default Upcoming;
