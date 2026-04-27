import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Typography,
  Stack,
  Grid,
  Card,
  Chip,
  Checkbox,
  IconButton,
  alpha,
  useTheme,
  Divider,
  LinearProgress,
  CircularProgress,
  Container,
} from '@mui/material';

// Icons
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import RocketLaunchRoundedIcon from '@mui/icons-material/RocketLaunchRounded';
import PendingActionsRoundedIcon from '@mui/icons-material/PendingActionsRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import EventRoundedIcon from '@mui/icons-material/EventRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';

import { format, isToday, isTomorrow, isAfter, isBefore, startOfToday, endOfWeek, parseISO, isWithinInterval, addDays } from 'date-fns';
import { supabase } from '../supabaseClient';

// --- CATEGORY COLOR ENGINE ---
const getCategoryColor = (theme, category) => {
  const cat = category?.toUpperCase();
  const colors = {
    WORK: theme.palette.primary.main,
    PERSONAL: '#AF52DE',
    GYM: theme.palette.success.main,
    STUDY: theme.palette.warning.main,
    HEALTH: theme.palette.error.main,
    OTHER: theme.palette.text.secondary,
  };
  return colors[cat] || theme.palette.text.secondary;
};

function Upcoming({ user }) {
  const theme = useTheme();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUpcomingTasks = useCallback(async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      // Fetch all tasks for the user to categorize accurately on client
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('user_id', user.id)
        .order('event_date', { ascending: true })
        .order('start_time', { ascending: true });
      
      if (error) throw error;
      
      const today = startOfToday();
      
      // Filter: Upcoming (today or later) OR (before today and incomplete)
      const filtered = (data || []).filter(task => {
        if (!task.event_date) return false;
        const taskDate = parseISO(task.event_date);
        const isUpcoming = isAfter(taskDate, today) || isToday(taskDate);
        const isOverdue = isBefore(taskDate, today) && !task.completed;
        return isUpcoming || isOverdue;
      });

      // For "Upcoming" page specifically, we exclude "Today" if needed, 
      // but usually "Upcoming" includes "Tomorrow onwards" and "Overdue".
      // Let's filter out "Today" tasks if they are already completed or just show everything from tomorrow.
      const upcomingAndOverdue = filtered.filter(task => !isToday(parseISO(task.event_date)));

      setTasks(upcomingAndOverdue);
    } catch (err) {
      console.error('Error fetching upcoming tasks:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchUpcomingTasks();
  }, [fetchUpcomingTasks]);

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

  // Grouping Logic
  const groups = useMemo(() => {
    const today = startOfToday();
    const tomorrow = addDays(today, 1);
    const weekEnd = endOfWeek(today, { weekStartsOn: 1 }); // Assuming Monday start

    return {
      overdue: tasks.filter(t => isBefore(parseISO(t.event_date), today) && !t.completed),
      tomorrow: tasks.filter(t => isTomorrow(parseISO(t.event_date))),
      thisWeek: tasks.filter(t => {
        const d = parseISO(t.event_date);
        return isAfter(d, tomorrow) && (isBefore(d, weekEnd) || d.getTime() === weekEnd.getTime());
      }),
      later: tasks.filter(t => isAfter(parseISO(t.event_date), weekEnd)),
    };
  }, [tasks]);

  // Stats
  const stats = useMemo(() => {
    return {
      total: tasks.length,
      tomorrow: groups.tomorrow.length,
      thisWeek: groups.thisWeek.length,
      overdue: groups.overdue.length,
    };
  }, [tasks, groups]);

  const TaskRow = ({ task }) => (
    <Box
      component={motion.div}
      whileHover={{ scale: 1.002, backgroundColor: theme.palette.action.hover }}
      transition={{ duration: 0.2 }}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        py: 2,
        px: { xs: 2, md: 3 },
        borderRadius: '12px',
        borderBottom: '1px solid',
        borderColor: theme.palette.divider,
        opacity: task.completed ? 0.4 : 1,
        transition: 'all 0.2s ease',
      }}
    >
      <Checkbox
        checked={task.completed}
        onChange={() => toggleComplete(task.id, task.completed)}
        sx={{
          p: 0,
          color: theme.palette.text.secondary,
          '&.Mui-checked': { color: theme.palette.success.main },
          '& .MuiSvgIcon-root': { fontSize: 24 }
        }}
      />
      
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="body1"
          sx={{
            fontWeight: 600,
            color: task.completed ? theme.palette.text.secondary : theme.palette.text.primary,
            textDecoration: task.completed ? 'line-through' : 'none',
            fontSize: '1rem',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {task.title}
        </Typography>
        <Typography variant="caption" sx={{ color: theme.palette.text.secondary, display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
          <CalendarMonthRoundedIcon sx={{ fontSize: 12 }} /> {format(parseISO(task.event_date), 'MMM d, yyyy')}
        </Typography>
      </Box>

      <Chip
        label={task.category?.toUpperCase() || 'OTHER'}
        size="small"
        sx={{
          bgcolor: alpha(getCategoryColor(theme, task.category), 0.1),
          color: getCategoryColor(theme, task.category),
          fontWeight: 800,
          fontSize: '10px',
          borderRadius: '6px',
          height: 22,
          display: { xs: 'none', sm: 'flex' }
        }}
      />

      <Stack direction="row" spacing={0.5} alignItems="center" sx={{ minWidth: { xs: 60, md: 80 }, justifyContent: 'flex-end' }}>
        <AccessTimeRoundedIcon sx={{ fontSize: 14, color: theme.palette.text.secondary }} />
        <Typography variant="caption" sx={{ fontWeight: 700, color: theme.palette.text.secondary }}>
          {task.start_time || 'Anytime'}
        </Typography>
      </Stack>

      <IconButton 
        size="small" 
        onClick={() => deleteTask(task.id)}
        sx={{ 
          color: alpha(theme.palette.error.main, 0.4),
          '&:hover': { color: theme.palette.error.main, bgcolor: alpha(theme.palette.error.main, 0.1) } 
        }}
      >
        <DeleteOutlineRoundedIcon fontSize="small" />
      </IconButton>
    </Box>
  );

  const Section = ({ title, icon, color, tasksList }) => (
    tasksList.length > 0 && (
      <Box sx={{ mb: 6 }}>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ px: 3, py: 2, borderBottom: '1px solid', borderColor: theme.palette.divider }}>
          <Box sx={{ color: color, display: 'flex' }}>
            {React.cloneElement(icon, { sx: { fontSize: 20 } })}
          </Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 900, letterSpacing: '0.1em', color: 'text.primary' }}>
            {title}
          </Typography>
          <Chip 
            label={tasksList.length} 
            size="small" 
            sx={{ 
              height: 20, fontSize: '11px', fontWeight: 900, 
              bgcolor: alpha(color, 0.1), color: color 
            }} 
          />
        </Stack>
        <Box sx={{ p: 1 }}>
          {tasksList.map(task => (
            <TaskRow key={task.id} task={task} />
          ))}
        </Box>
      </Box>
    )
  );

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: 'background.default' }}>
      <CircularProgress size={40} thickness={5} sx={{ color: theme.palette.primary.main }} />
    </Box>
  );

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100%', pb: 4, color: 'text.primary' }}>
      
      {/* --- HERO SECTION --- */}
      <Box sx={{ 
        pt: { xs: 4, md: 8 }, pb: { xs: 6, md: 10 }, mb: -4,
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}>
        <Container maxWidth={false} sx={{ px: { xs: 2, md: 6 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1.5 }}>
                <Typography variant="h2" sx={{ fontWeight: 900, letterSpacing: '-0.04em', fontSize: { xs: '2rem', sm: '2.5rem', md: '4rem' } }}>Upcoming</Typography>
                <Chip 
                  label="Next 7 Days" 
                  size="small" 
                  sx={{ 
                    bgcolor: alpha(theme.palette.primary.main, 0.1), 
                    color: theme.palette.primary.main, 
                    fontWeight: 800,
                    borderRadius: '8px',
                    px: 1,
                  }} 
                />
              </Stack>
              <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 500, fontSize: { xs: '1rem', md: '1.2rem' } }}>Plan ahead and stay in control.</Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth={false} sx={{ px: { xs: 2, md: 6 } }}>
        
        {/* --- SUMMARY CARDS --- */}
        <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: { xs: 3, md: 6 } }}>
          {[
            { label: 'Total Upcoming', val: stats.total, icon: <EventRoundedIcon />, color: theme.palette.primary.main },
            { label: 'Tomorrow', val: stats.tomorrow, icon: <RocketLaunchRoundedIcon />, color: theme.palette.success.main },
            { label: 'This Week', val: stats.thisWeek, icon: <CalendarMonthRoundedIcon />, color: theme.palette.warning.main },
            { label: 'Overdue', val: stats.overdue, icon: <HistoryRoundedIcon />, color: theme.palette.error.main },
          ].map((item, idx) => (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <Card
                component={motion.div}
                whileHover={{ translateY: -3, backgroundColor: theme.palette.action.hover }}
                transition={{ duration: 0.25 }}
                sx={{
                  p: { xs: 2, md: 3 },
                  borderRadius: { xs: '16px', md: '20px' },
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2.5,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: alpha(item.color, 0.2),
                  }
                }}
              >
                <Box sx={{ 
                  p: 1.5, 
                  borderRadius: '12px', 
                  bgcolor: alpha(item.color, 0.1), 
                  color: item.color, 
                  display: 'flex' 
                }}>
                  {React.cloneElement(item.icon, { sx: { fontSize: 32 } })}
                </Box>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 900, color: 'text.primary', lineHeight: 1 }}>{item.val}</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {item.label}
                  </Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* --- MAIN CONTENT AREA --- */}
        <Grid container spacing={4}>
          
          {/* LEFT SIDE: TASK GROUPS (70%) */}
          <Grid item xs={12} md={8.4}>
            {tasks.length === 0 ? (
              <Card sx={{ 
                p: 8, 
                borderRadius: '32px', 
                bgcolor: 'background.paper', 
                border: '1px solid', 
                borderColor: 'divider',
                textAlign: 'center'
              }}>
                <Box sx={{ 
                  width: 80, height: 80, borderRadius: '24px', 
                  bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 24px'
                }}>
                  <AutoAwesomeRoundedIcon sx={{ fontSize: 40 }} />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 900, mb: 1, color: 'text.primary' }}>📅 Your future is clear</Typography>
                <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 500 }}>Add new tasks to see your roadmap.</Typography>
              </Card>
            ) : (
              <Card sx={{ 
                borderRadius: '24px', 
                bgcolor: 'background.paper', 
                border: '1px solid', 
                borderColor: 'divider',
                overflow: 'hidden'
              }}>
                <Box sx={{ p: 1 }}>
                  <Section title="OVERDUE" icon={<ErrorOutlineRoundedIcon />} color={theme.palette.error.main} tasksList={groups.overdue} />
                  <Section title="TOMORROW" icon={<RocketLaunchRoundedIcon />} color={theme.palette.success.main} tasksList={groups.tomorrow} />
                  <Section title="THIS WEEK" icon={<CalendarMonthRoundedIcon />} color={theme.palette.warning.main} tasksList={groups.thisWeek} />
                  <Section title="LATER" icon={<TrendingUpRoundedIcon />} color={theme.palette.primary.main} tasksList={groups.later} />
                </Box>
              </Card>
            )}
          </Grid>

          {/* RIGHT SIDE: SMART SIDEBAR (30%) */}
          <Grid item xs={12} md={3.6}>
            <Stack spacing={3}>
              
              {/* 1. Nearest Deadline */}
              <Card sx={{ 
                p: 3, borderRadius: '24px', bgcolor: 'background.paper', 
                border: '1px solid', borderColor: 'divider',
              }}>
                <Typography variant="h6" sx={{ fontWeight: 900, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TimerRoundedIcon sx={{ color: theme.palette.error.main }} /> Nearest Deadline
                </Typography>
                {tasks.length > 0 ? (
                   <Box>
                     <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 700, mb: 0.5 }}>
                       {tasks[0].title}
                     </Typography>
                     <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                       {format(parseISO(tasks[0].event_date), 'EEEE, MMM d')} at {tasks[0].start_time || 'Anytime'}
                     </Typography>
                   </Box>
                ) : (
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>No upcoming deadlines.</Typography>
                )}
              </Card>

              {/* 2. Busy Day This Week */}
              <Card sx={{ 
                p: 3, borderRadius: '24px', bgcolor: 'background.paper', 
                border: '1px solid', borderColor: 'divider' 
              }}>
                <Typography variant="h6" sx={{ fontWeight: 900, mb: 2 }}>Busy Day This Week</Typography>
                {tasks.length > 0 ? (
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box sx={{ p: 1.5, borderRadius: '12px', bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main }}>
                      <CalendarMonthRoundedIcon />
                    </Box>
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 800 }}>
                        {format(parseISO(tasks[0].event_date), 'EEEE')}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Most tasks scheduled.
                      </Typography>
                    </Box>
                  </Stack>
                ) : (
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>Your week looks open.</Typography>
                )}
              </Card>

              {/* 3. Motivation Card */}
              <Card sx={{ 
                p: 3, borderRadius: '24px', bgcolor: 'background.paper', 
                border: '1px solid', borderColor: 'divider',
                position: 'relative', overflow: 'hidden'
              }}>
                <Box sx={{ position: 'absolute', top: -20, right: -20, opacity: 0.05, color: theme.palette.text.secondary }}>
                  <AutoAwesomeRoundedIcon sx={{ fontSize: 120 }} />
                </Box>
                <Typography variant="caption" sx={{ fontWeight: 800, color: theme.palette.primary.main, textTransform: 'uppercase', mb: 1, display: 'block' }}>
                  PLANNING TIP
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, fontStyle: 'italic', lineHeight: 1.4 }}>
                  "The best way to predict the future is to create it."
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', mt: 2, display: 'block', fontWeight: 600 }}>
                  Stay ahead of your goals.
                </Typography>
              </Card>

            </Stack>
          </Grid>
        </Grid>

      </Container>
    </Box>
  );
}

// Timer icon for Sidebar
const TimerRoundedIcon = (props) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM15.5 16.5L11 13V7H12.5V12.25L16.25 15.12L15.5 16.5Z" fill="currentColor"/>
  </svg>
);

export default Upcoming;
