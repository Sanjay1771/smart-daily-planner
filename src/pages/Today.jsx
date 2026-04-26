import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Typography,
  Container,
  Stack,
  Grid,
  Card,
  Chip,
  Checkbox,
  List,
  ListItem,
  IconButton,
  alpha,
  useTheme,
  Divider,
  LinearProgress,
  CircularProgress,
  Grow
} from '@mui/material';

// Icons
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import WbSunnyRoundedIcon from '@mui/icons-material/WbSunnyRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import NightsStayRoundedIcon from '@mui/icons-material/NightsStayRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import AssignmentTurnedInRoundedIcon from '@mui/icons-material/AssignmentTurnedInRounded';
import PendingActionsRoundedIcon from '@mui/icons-material/PendingActionsRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';

import { format, isToday } from 'date-fns';
import { supabase } from '../supabaseClient';

function Today({ user }) {
  const muiTheme = useTheme();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTodayTasks = useCallback(async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('user_id', user.id)
        .order('start_time', { ascending: true });
      
      if (error) throw error;
      
      // Filter for today
      const todayTasks = (data || []).filter(task => {
        if (!task.event_date) return false;
        // Adjust for potential timezone offsets by using only the date part for comparison if needed
        // but isToday with a new Date(task.event_date) is usually fine for ISO strings
        return isToday(new Date(task.event_date));
      });

      setTasks(todayTasks);
    } catch (err) {
      console.error('Error fetching today\'s tasks:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchTodayTasks();
  }, [fetchTodayTasks]);

  const toggleComplete = async (id, currentStatus) => {
    try {
      const { error } = await supabase
        .from('events')
        .update({ completed: !currentStatus })
        .eq('id', id);
      if (error) throw error;
      setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !currentStatus } : t));
    } catch (err) {
      console.error('Error toggling completion:', err);
    }
  };

  const deleteTask = async (id) => {
    try {
      const { error } = await supabase.from('events').delete().eq('id', id);
      if (error) throw error;
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  // Helper for category colors
  const getCategoryColor = (category) => {
    const cat = category?.toUpperCase();
    const colors = {
      WORK: '#0071E3',      // Blue
      PERSONAL: '#AF52DE',  // Purple
      GYM: '#34C759',       // Green
      STUDY: '#FF9500',     // Orange
      HEALTH: '#FF3B30',    // Red
      SHOPPING: '#FF2D55',  // Pink
      OTHER: '#8E8E93',     // Gray
    };
    return colors[cat] || '#8E8E93';
  };

  // Stats calculation
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Grouping logic
  const morningTasks = tasks.filter(t => {
    if (!t.start_time) return false;
    const hour = parseInt(t.start_time.split(':')[0]);
    return hour < 12;
  });

  const afternoonTasks = tasks.filter(t => {
    if (!t.start_time) return false;
    const hour = parseInt(t.start_time.split(':')[0]);
    return hour >= 12 && hour < 18;
  });

  const eveningTasks = tasks.filter(t => {
    if (!t.start_time) return false;
    const hour = parseInt(t.start_time.split(':')[0]);
    return hour >= 18;
  });

  const unscheduledTasks = tasks.filter(t => !t.start_time);

  const TaskItem = ({ task }) => (
    <ListItem sx={{ 
      p: 0, mb: 1.5, borderRadius: '16px', border: '1px solid', borderColor: 'divider',
      bgcolor: task.completed ? alpha(muiTheme.palette.background.paper, 0.5) : 'background.paper',
      transition: '0.2s',
      opacity: task.completed ? 0.7 : 1,
      '&:hover': { bgcolor: alpha(muiTheme.palette.primary.main, 0.02), transform: 'translateY(-2px)' }
    }}>
      <Box sx={{ width: '100%', px: 2.5, py: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Checkbox 
          checked={task.completed} 
          onChange={() => toggleComplete(task.id, task.completed)}
          sx={{ p: 0, '&.Mui-checked': { color: 'success.main' } }}
        />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="body1" sx={{ 
            fontWeight: 800, fontSize: '1.05rem', 
            color: task.completed ? 'text.secondary' : 'text.primary',
            textDecoration: task.completed ? 'line-through' : 'none',
            lineHeight: 1.2,
            mb: 0.5
          }}>
            {task.title}
          </Typography>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Chip 
              label={task.category} 
              size="small" 
              sx={{ 
                fontWeight: 900, borderRadius: '20px', px: '10px', height: 22, fontSize: '11px', textTransform: 'uppercase',
                bgcolor: getCategoryColor(task.category), color: 'white'
              }} 
            />
            <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <AccessTimeRoundedIcon sx={{ fontSize: 13 }} /> {task.start_time || 'Unscheduled'}
            </Typography>
          </Stack>
        </Box>
        <Stack direction="row" spacing={0.5}>
          <IconButton size="small" color="error" onClick={() => deleteTask(task.id)} sx={{ opacity: 0.6, '&:hover': { opacity: 1 } }}>
            <DeleteOutlineRoundedIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Box>
    </ListItem>
  );

  const TaskSection = ({ title, icon, tasksList, color }) => (
    <Box sx={{ mb: 4 }}>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
        <Box sx={{ p: 1, borderRadius: '8px', bgcolor: alpha(color, 0.1), color: color, display: 'flex' }}>
          {React.cloneElement(icon, { sx: { fontSize: 20 } })}
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 900, letterSpacing: '-0.02em' }}>{title}</Typography>
        <Typography variant="caption" sx={{ ml: 'auto', fontWeight: 800, color: 'text.disabled', bgcolor: alpha(muiTheme.palette.text.disabled, 0.1), px: 1, py: 0.25, borderRadius: '6px' }}>
          {tasksList.length}
        </Typography>
      </Stack>
      <List disablePadding>
        {tasksList.map(task => <TaskItem key={task.id} task={task} />)}
      </List>
    </Box>
  );

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <CircularProgress size={40} thickness={5} />
    </Box>
  );

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 10 }}>
      <Container maxWidth="lg">
        <Box sx={{ pt: 5, mb: 6 }}>
          <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: '-0.04em', mb: 1 }}>Today</Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 600 }}>Focus on what matters now.</Typography>
        </Box>

        {/* 1. SUMMARY CARDS */}
        <Grid 
          container 
          spacing={3} 
          sx={{ mb: 6 }}
          component={motion.div}
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.05 } }
          }}
        >
          {[
            { label: 'Total Today', val: total, color: muiTheme.palette.primary.main, icon: <AssignmentTurnedInRoundedIcon /> },
            { label: 'Pending', val: pending, color: '#FF9500', icon: <PendingActionsRoundedIcon /> },
            { label: 'Completed', val: completed, color: '#34C759', icon: <AssignmentTurnedInRoundedIcon /> },
            { label: 'Progress', val: `${progress}%`, color: '#0071E3', icon: <AutoAwesomeRoundedIcon /> },
          ].map((stat, idx) => (
            <Grid 
              item xs={12} sm={6} md={3} key={idx}
              component={motion.div}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } }
              }}
            >
              <Card sx={{ 
                p: 3, borderRadius: '24px', border: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 2.5,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': { transform: 'translateY(-6px)', boxShadow: '0 12px 24px rgba(0,0,0,0.1)', borderColor: alpha(stat.color, 0.4) }
              }}>
                <Box sx={{ p: 1.5, borderRadius: '12px', bgcolor: alpha(stat.color, 0.1), color: stat.color, display: 'flex' }}>
                  {React.cloneElement(stat.icon, { sx: { fontSize: 28 } })}
                </Box>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 900, lineHeight: 1 }}>{stat.val}</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '0.05em', mt: 0.5, display: 'block' }}>
                    {stat.label}
                  </Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        {total > 0 && (
          <Box sx={{ mb: 6 }}>
             <Typography variant="caption" sx={{ fontWeight: 900, color: 'text.secondary', mb: 1, display: 'block' }}>DAILY COMPLETION</Typography>
             <LinearProgress 
               variant="determinate" 
               value={progress} 
               sx={{ height: 12, borderRadius: '6px', bgcolor: alpha(muiTheme.palette.primary.main, 0.1), '& .MuiLinearProgress-bar': { borderRadius: '6px' } }} 
             />
          </Box>
        )}

        {/* 2. TASK SECTIONS */}
        <Box>
          {total === 0 ? (
            <Box sx={{ py: 12, textAlign: 'center', bgcolor: alpha(muiTheme.palette.background.paper, 0.5), borderRadius: '32px', border: '2px dashed', borderColor: 'divider' }}>
               <AutoAwesomeRoundedIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 3, opacity: 0.2 }} />
               <Typography variant="h5" sx={{ fontWeight: 900, color: 'text.secondary', mb: 1 }}>No tasks for today.</Typography>
               <Typography variant="body1" sx={{ color: 'text.disabled', fontWeight: 600 }}>Plan something great and master your day.</Typography>
            </Box>
          ) : (
            <Grid container spacing={4}>
              <Grid item xs={12} md={8}>
                {morningTasks.length > 0 && (
                  <TaskSection title="Morning" color="#FF9500" icon={<WbSunnyRoundedIcon />} tasksList={morningTasks} />
                )}
                {afternoonTasks.length > 0 && (
                  <TaskSection title="Afternoon" color="#0071E3" icon={<LightModeRoundedIcon />} tasksList={afternoonTasks} />
                )}
                {eveningTasks.length > 0 && (
                  <TaskSection title="Evening" color="#AF52DE" icon={<NightsStayRoundedIcon />} tasksList={eveningTasks} />
                )}
                {unscheduledTasks.length > 0 && (
                  <TaskSection title="Unscheduled" color="#8E8E93" icon={<AssignmentTurnedInRoundedIcon />} tasksList={unscheduledTasks} />
                )}
              </Grid>
              
              <Grid item xs={12} md={4}>
                {/* Secondary Sidebar Info / Tips */}
                <Card sx={{ p: 4, borderRadius: '24px', border: '1px solid', borderColor: 'divider', bgcolor: alpha(muiTheme.palette.primary.main, 0.02) }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 2 }}>Today's Focus</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600, mb: 3 }}>
                    You have {pending} pending tasks to tackle. Prioritize the ones that move the needle.
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  <Typography variant="caption" sx={{ fontWeight: 800, color: 'primary.main', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Tip of the day
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, mt: 1 }}>
                    "The secret of your future is hidden in your daily routine."
                  </Typography>
                </Card>
              </Grid>
            </Grid>
          )}
        </Box>
      </Container>
    </Box>
  );
}

export default Today;
