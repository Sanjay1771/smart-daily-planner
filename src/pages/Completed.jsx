import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Container,
  Stack,
  CircularProgress,
  alpha,
  useTheme,
  Paper,
  Chip
} from '@mui/material';
import CheckBoxRoundedIcon from '@mui/icons-material/CheckBoxRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
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
      setTasks((data || []).map(row => ({ ...row, date: row.event_date, time: row.start_time })));
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
      <Stack spacing={4}>
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 900, mb: 1, letterSpacing: '-0.04em', fontSize: { xs: '2rem', md: '3rem' } }}>
            Completed Tasks
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 600 }}>
            Tasks you have finished
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : tasks.length === 0 ? (
          <Paper variant="outlined" sx={{ p: 8, textAlign: 'center', borderColor: 'divider', bgcolor: alpha(muiTheme.palette.text.primary, 0.01), borderStyle: 'dashed', borderRadius: '24px' }}>
            <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 600 }}>
              No completed tasks yet
            </Typography>
          </Paper>
        ) : (
          <Stack spacing={2}>
            {tasks.map((task) => (
              <Paper
                key={task.id}
                elevation={0}
                sx={{
                  p: { xs: 2, md: 3 },
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: '16px',
                  opacity: 0.7,
                  transition: 'all 0.2s',
                  '&:hover': { 
                    opacity: 1,
                    borderColor: 'primary.main', 
                    bgcolor: alpha(muiTheme.palette.primary.main, 0.01),
                    transform: 'translateX(4px)'
                  }
                }}
              >
                <CheckBoxRoundedIcon sx={{ fontSize: 28, color: 'text.disabled' }} />
                
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="body1"
                    noWrap
                    sx={{
                      fontWeight: 700,
                      textDecoration: 'line-through',
                      color: 'text.secondary',
                      letterSpacing: '-0.01em'
                    }}
                  >
                    {task.title}
                  </Typography>
                  <Stack direction="row" spacing={2} alignItems="center" mt={0.5} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                    <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 600 }}>
                      {task.time ? new Date('2000-01-01T' + task.time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) : ''}
                      {task.time && task.date ? ' · ' : ''}
                      {task.date ? new Date(task.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : ''}
                    </Typography>
                    {task.category && (
                      <Chip 
                        label={task.category} 
                        size="small" 
                        sx={{ height: 18, fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase', bgcolor: alpha(muiTheme.palette.primary.main, 0.05), color: 'primary.main' }} 
                      />
                    )}
                  </Stack>
                </Box>

                <Stack direction="row" spacing={1} alignItems="center">
                   <CheckCircleRoundedIcon sx={{ fontSize: 20, color: 'success.main' }} />
                   <Typography variant="caption" sx={{ fontWeight: 800, color: 'success.main', textTransform: 'uppercase', display: { xs: 'none', sm: 'block' } }}>
                     Completed
                   </Typography>
                </Stack>
              </Paper>
            ))}
          </Stack>
        )}
      </Stack>
    </Container>
  );
}

export default Completed;
