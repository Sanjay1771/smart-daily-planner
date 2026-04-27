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
import WbSunnyRoundedIcon from '@mui/icons-material/WbSunnyRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import NightsStayRoundedIcon from '@mui/icons-material/NightsStayRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import AssignmentTurnedInRoundedIcon from '@mui/icons-material/AssignmentTurnedInRounded';
import PendingActionsRoundedIcon from '@mui/icons-material/PendingActionsRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import RocketLaunchRoundedIcon from '@mui/icons-material/RocketLaunchRounded';
import LocalFireDepartmentRoundedIcon from '@mui/icons-material/LocalFireDepartmentRounded';

import { format, isToday } from 'date-fns';
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

function Today({ user }) {
  const theme = useTheme();
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
      
      const todayTasks = (data || []).filter(task => {
        if (!task.event_date) return false;
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

  // Stats calculation
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, pending, progress };
  }, [tasks]);

  // Grouping logic
  const sections = useMemo(() => {
    const morning = tasks.filter(t => {
      if (!t.start_time) return false;
      const hour = parseInt(t.start_time.split(':')[0]);
      return hour < 12;
    });

    const afternoon = tasks.filter(t => {
      if (!t.start_time) return false;
      const hour = parseInt(t.start_time.split(':')[0]);
      return hour >= 12 && hour < 18;
    });

    const evening = tasks.filter(t => {
      if (!t.start_time) return false;
      const hour = parseInt(t.start_time.split(':')[0]);
      return hour >= 18;
    });

    const unscheduled = tasks.filter(t => !t.start_time);

    return [
      { title: 'MORNING', icon: <WbSunnyRoundedIcon />, color: theme.palette.warning.main, tasks: morning },
      { title: 'AFTERNOON', icon: <LightModeRoundedIcon />, color: theme.palette.primary.main, tasks: afternoon },
      { title: 'EVENING', icon: <NightsStayRoundedIcon />, color: '#AF52DE', tasks: evening },
      { title: 'FLEXIBLE', icon: <AutoAwesomeRoundedIcon />, color: theme.palette.text.secondary, tasks: unscheduled },
    ].filter(s => s.tasks.length > 0);
  }, [tasks, theme]);

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
      
      <Typography
        variant="body1"
        sx={{
          flex: 1,
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

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: 'background.default' }}>
      <CircularProgress size={40} thickness={5} sx={{ color: theme.palette.primary.main }} />
    </Box>
  );

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100%', pb: 4, color: 'text.primary' }}>
      
      {/* --- HERO SECTION MATCHED TO DASHBOARD --- */}
      <Box sx={{ 
        pt: { xs: 4, md: 8 }, pb: { xs: 6, md: 10 }, mb: -4,
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}>
        <Container maxWidth={false} sx={{ px: { xs: 2, md: 6 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1.5, flexWrap: 'wrap' }}>
                <Typography variant="h2" sx={{ fontWeight: 900, letterSpacing: '-0.04em', fontSize: { xs: '2rem', sm: '2.5rem', md: '4rem' } }}>Today</Typography>
                <Chip 
                  label={`${stats.progress}% Completed`} 
                  size="small" 
                  sx={{ 
                    bgcolor: alpha(theme.palette.primary.main, 0.1), 
                    color: theme.palette.primary.main, 
                    fontWeight: 800,
                    borderRadius: '8px',
                    px: 1,
                    display: { xs: 'none', sm: 'flex' }
                  }} 
                />
              </Stack>
              <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 500, fontSize: { xs: '1rem', md: '1.2rem' } }}>Focus on what matters now.</Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', fontSize: { xs: '1.1rem', md: '1.5rem' } }}>
                {format(new Date(), 'EEEE, MMMM d')}
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth={false} sx={{ px: { xs: 2, md: 6 } }}>
        
        {/* --- ROW 2: SUMMARY CARDS --- */}
        <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: { xs: 3, md: 6 } }}>
          {[
            { label: 'Total Today', val: stats.total, icon: <RocketLaunchRoundedIcon />, color: theme.palette.primary.main },
            { label: 'Pending', val: stats.pending, icon: <PendingActionsRoundedIcon />, color: theme.palette.warning.main },
            { label: 'Completed', val: stats.completed, icon: <CheckCircleRoundedIcon />, color: theme.palette.success.main },
            { label: 'Progress %', val: `${stats.progress}%`, icon: <LocalFireDepartmentRoundedIcon />, color: theme.palette.primary.main },
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
          
          {/* LEFT SIDE: TASK FEED (70%) */}
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
                <Typography variant="h4" sx={{ fontWeight: 900, mb: 1, color: 'text.primary' }}>🎯 No tasks for today</Typography>
                <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 500 }}>Plan something great and own the day.</Typography>
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
                  {sections.map((section, sIdx) => (
                    <Box key={sIdx} sx={{ mb: sIdx === sections.length - 1 ? 0 : 4 }}>
                      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ px: 3, py: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                        <Box sx={{ color: section.color, display: 'flex' }}>
                          {React.cloneElement(section.icon, { sx: { fontSize: 20 } })}
                        </Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 900, letterSpacing: '0.1em', color: 'text.primary' }}>
                          {section.title}
                        </Typography>
                        <Chip 
                          label={section.tasks.length} 
                          size="small" 
                          sx={{ 
                            height: 20, fontSize: '11px', fontWeight: 900, 
                            bgcolor: alpha(section.color, 0.1), color: section.color 
                          }} 
                        />
                      </Stack>
                      <Box sx={{ p: 1 }}>
                        {section.tasks.map(task => (
                          <TaskRow key={task.id} task={task} />
                        ))}
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Card>
            )}
          </Grid>

          {/* RIGHT SIDE: SMART SIDEBAR (30%) */}
          <Grid item xs={12} md={3.6}>
            <Stack spacing={3}>
              
              {/* 1. Today's Focus */}
              <Card sx={{ 
                p: 3, borderRadius: '24px', bgcolor: 'background.paper', 
                border: '1px solid', borderColor: 'divider',
              }}>
                <Typography variant="h6" sx={{ fontWeight: 900, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <RocketLaunchRoundedIcon sx={{ color: theme.palette.primary.main }} /> Today's Focus
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 500, lineHeight: 1.6 }}>
                  {stats.pending > 0 
                    ? `You have ${stats.pending} pending tasks. Finish highest priority first.`
                    : "You've cleared your list! Great job staying productive."}
                </Typography>
              </Card>

              {/* 2. Completion Progress */}
              <Card sx={{ 
                p: 3, borderRadius: '24px', bgcolor: 'background.paper', 
                border: '1px solid', borderColor: 'divider' 
              }}>
                <Typography variant="h6" sx={{ fontWeight: 900, mb: 3 }}>Completion Progress</Typography>
                <Box sx={{ position: 'relative', display: 'inline-flex', width: '100%', justifyContent: 'center', mb: 2 }}>
                  <CircularProgress
                    variant="determinate"
                    value={100}
                    size={120}
                    thickness={4}
                    sx={{ color: alpha(theme.palette.text.secondary, 0.1) }}
                  />
                  <CircularProgress
                    variant="determinate"
                    value={stats.progress}
                    size={120}
                    thickness={4}
                    sx={{ 
                      color: theme.palette.primary.main,
                      position: 'absolute',
                      left: 'calc(50% - 60px)',
                      strokeLinecap: 'round',
                    }}
                  />
                  <Box sx={{
                    top: 0, left: 0, bottom: 0, right: 0,
                    position: 'absolute', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Typography variant="h4" sx={{ fontWeight: 900 }}>{stats.progress}%</Typography>
                  </Box>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={stats.progress} 
                  sx={{ 
                    height: 8, borderRadius: '4px', bgcolor: alpha(theme.palette.primary.main, 0.1),
                    '& .MuiLinearProgress-bar': { borderRadius: '4px', bgcolor: theme.palette.primary.main }
                  }} 
                />
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
                  MOTIVATION
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, fontStyle: 'italic', lineHeight: 1.4 }}>
                  "Small daily progress still wins."
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', mt: 2, display: 'block', fontWeight: 600 }}>
                  Stay consistent, stay smart.
                </Typography>
              </Card>

            </Stack>
          </Grid>
        </Grid>

      </Container>
    </Box>
  );
}

export default Today;
