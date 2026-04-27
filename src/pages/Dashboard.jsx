import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Typography,
  Grid,
  Card,
  Button,
  Stack,
  LinearProgress,
  CircularProgress,
  useTheme as useMuiTheme,
  alpha,
  Container,
  Snackbar,
  Alert,
  Avatar,
  TextField,
  Chip,
  IconButton,
  Tooltip,
  List,
  ListItem,
  Checkbox,
  Fade,
  Grow,
  Divider,
  Tabs,
  Tab,
  useMediaQuery,
  InputBase,
  Paper,
} from '@mui/material';

// Icons
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import PendingActionsRoundedIcon from '@mui/icons-material/PendingActionsRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import RocketLaunchRoundedIcon from '@mui/icons-material/RocketLaunchRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import LocalFireDepartmentRoundedIcon from '@mui/icons-material/LocalFireDepartmentRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import TodayRoundedIcon from '@mui/icons-material/TodayRounded';
import StarsRoundedIcon from '@mui/icons-material/StarsRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';

import TaskForm from '../components/TaskForm';
import EditTaskDialog from '../components/EditTaskDialog';
import { supabase } from '../supabaseClient';
import { format, isToday, isPast, parseISO, startOfDay, formatDistanceToNow } from 'date-fns';

function Dashboard({ user }) {
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));

  // --- STATE ---
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [editingTask, setEditingTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all'); // all, pending, high
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // --- BACKEND LOGIC ---
  const fetchTasks = useCallback(async () => {
    if (!user?.id) return;
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setTasks((data || []).map(row => ({ ...row, date: row.event_date, time: row.start_time })));
    } catch (error) {
      showSnackbar('Error updating workspace', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const showSnackbar = (message, severity = 'success') => setSnackbar({ open: true, message, severity });

  const addTask = async (task) => {
    try {
      const { data, error } = await supabase.from('events').insert([{
        user_id: user.id, title: task.title, event_date: task.date, start_time: task.time,
        category: task.category || 'work', priority: task.priority || 'medium', description: task.description || '', completed: false,
      }]).select();
      if (error) throw error;
      if (data) { showSnackbar('Task successfully added'); fetchTasks(); setShowTaskForm(false); }
    } catch (error) { showSnackbar(error.message, 'error'); }
  };

  const handleUpdateTask = async (updatedTask) => {
    try {
      const { error } = await supabase.from('events').update({
        title: updatedTask.title, event_date: updatedTask.date, start_time: updatedTask.time,
        category: updatedTask.category, priority: updatedTask.priority, description: updatedTask.description,
      }).eq('id', updatedTask.id);
      if (error) throw error;
      showSnackbar('Changes saved'); setEditingTask(null); fetchTasks();
    } catch (error) { showSnackbar(error.message, 'error'); }
  };

  const toggleComplete = async (id) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    const newStatus = !task.completed;
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: newStatus } : t));
    try {
      const { error } = await supabase.from('events').update({ completed: newStatus }).eq('id', id);
      if (error) throw error;
    } catch (error) {
      setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !newStatus } : t));
    }
  };

  const deleteTask = async (id) => {
    try {
      const { error } = await supabase.from('events').delete().eq('id', id);
      if (error) throw error;
      showSnackbar('Task removed', 'info');
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (error) { showSnackbar(error.message, 'error'); }
  };

  // --- STATS ---
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
    const today = tasks.filter(t => t.date && isToday(parseISO(t.date))).length;
    return { total, completed, pending, rate, today };
  }, [tasks]);

  // --- FILTERED FEED ---
  const filteredFeed = useMemo(() => {
    let feed = tasks.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()));
    if (filter === 'pending') feed = feed.filter(t => !t.completed);
    if (filter === 'high') feed = feed.filter(t => t.priority === 'high');
    return [...feed].sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      if (a.priority !== b.priority) return a.priority === 'high' ? -1 : 1;
      return new Date(b.created_at) - new Date(a.created_at);
    });
  }, [tasks, searchQuery, filter]);

  const firstName = user?.name?.split(' ')[0] || 'User';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  // ── CATEGORY COLOR ENGINE ──
  const getCategoryColor = (theme, category) => {
    const cat = category?.toUpperCase();
    const colors = {
      WORK: theme.palette.primary.main,
      PERSONAL: '#AF52DE',
      GYM: theme.palette.success.main,
      STUDY: theme.palette.warning.main,
      HEALTH: theme.palette.error.main,
      SHOPPING: '#FF2D55',
      OTHER: theme.palette.text.secondary,
    };
    return colors[cat] || theme.palette.text.secondary;
  };

  const currentDate = format(currentTime, 'EEEE, MMM d');
  const currentTimeStr = format(currentTime, 'h:mm a');

  if (isLoading && tasks.length === 0) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: 'background.default' }}>
      <CircularProgress size={30} thickness={5} color="primary" />
    </Box>
  );

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100%', pb: 4, color: 'text.primary' }}>

      {/* 1. CLEAN GREETING SECTION */}
      <Box sx={{ 
        width: '100%', height: { xs: 'auto', md: 100 }, py: { xs: 2, md: 0 }, px: { xs: 2, md: 4 }, 
        bgcolor: 'background.paper',
        borderBottom: '1px solid', borderColor: 'divider',
        display: 'flex', alignItems: 'center'
      }}>
        <Container maxWidth={false}>
          <Stack direction="row" alignItems="center" sx={{ flexWrap: 'wrap', gap: 1 }}>
            {/* Left: Identity Only */}
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ 
                width: 44, height: 44, border: '2px solid', borderColor: 'primary.main',
                bgcolor: alpha(muiTheme.palette.primary.main, 0.1), color: 'primary.main', fontWeight: 900, fontSize: '1.2rem'
              }}>
                {firstName[0]}
              </Avatar>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.1, fontSize: { xs: '1.5rem', md: '2rem' } }}>
                  {greeting}, {firstName}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontStyle: 'italic', display: 'block' }}>
                  Master your day.
                </Typography>
              </Box>
            </Stack>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth={false} sx={{ mt: 3, px: { xs: 2, md: 4 } }}>
        <Stack spacing={3}>

          {/* 2. REFINED METRIC CARDS (Full Row Occupancy) */}
          <Box 
            component={motion.div}
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.05 } }
            }}
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(4, 1fr)'
              },
              gap: '16px',
              width: '100%'
            }}
          >
            {[
              { label: 'TOTAL', val: stats.total, icon: <AssignmentRoundedIcon />, color: muiTheme.palette.primary.main },
              { label: 'PENDING', val: stats.pending, icon: <PendingActionsRoundedIcon />, color: muiTheme.palette.warning.main },
              { label: 'DONE', val: stats.completed, icon: <CheckCircleRoundedIcon />, color: muiTheme.palette.success.main },
              { label: 'TODAY', val: null, icon: <TodayRoundedIcon />, color: muiTheme.palette.info.main },
            ].map((stat, idx) => (
              <Card 
                key={idx} 
                component={motion.div}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } }
                }}
                sx={{
                  p: '16px', borderRadius: '16px', border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper',
                  height: { xs: 'auto', md: 138 }, width: '100%', display: 'flex', alignItems: 'center', gap: 2.5,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': { 
                    transform: 'translateY(-6px) scale(1.01)', 
                    boxShadow: theme => theme.palette.mode === 'dark' ? '0 12px 24px rgba(0,0,0,0.4)' : '0 12px 24px rgba(0,0,0,0.08)',
                    borderColor: alpha(stat.color, 0.6) 
                  }
                }}
              >
                <Box sx={{ p: 1.25, borderRadius: '12px', bgcolor: alpha(stat.color, 0.1), color: stat.color, display: 'flex' }}>
                  {React.cloneElement(stat.icon, { sx: { fontSize: 34 } })}
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  {idx === 3 ? (
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 900, fontSize: '1.2rem', lineHeight: 1, color: 'text.primary' }}>{currentDate}</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 800, color: 'text.secondary', mt: 1 }}>{currentTimeStr}</Typography>
                    </Box>
                  ) : (
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: '-0.02em', color: 'text.primary' }}>{stat.val}</Typography>
                      <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', letterSpacing: '0.05em', mt: 0.5, display: 'block' }}>
                        {stat.label}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Card>
            ))}
          </Box>

          {/* 3. CLEAN ACTION BAR (Search removed) */}
          <Box sx={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: 1.5,
            bgcolor: 'background.paper', p: { xs: 1, sm: 1.5 }, borderRadius: '16px', border: '1px solid', borderColor: 'divider'
          }}>
            <Stack direction="row" spacing={{ xs: 1, sm: 2 }} alignItems="center" sx={{ flexWrap: 'wrap', gap: 1 }}>
              <Button
                variant="contained" 
                startIcon={<AddRoundedIcon />}
                onClick={() => setShowTaskForm(!showTaskForm)}
                sx={{ borderRadius: '10px', px: { xs: 2, sm: 3 }, py: 1, fontWeight: 800, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
              >
                Assemble Task
              </Button>

              <Divider orientation="vertical" flexItem sx={{ height: 24, my: 'auto', borderColor: 'divider', display: { xs: 'none', sm: 'block' } }} />

              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                {['all', 'pending', 'high'].map((f) => (
                  <Chip
                    key={f} label={f.charAt(0).toUpperCase() + f.slice(1)}
                    onClick={() => setFilter(f)}
                    sx={{
                      height: { xs: 30, sm: 36 }, px: 1, fontWeight: 800, borderRadius: '10px',
                      fontSize: { xs: '0.75rem', sm: '0.8125rem' },
                      bgcolor: filter === f ? 'primary.main' : 'transparent',
                      color: filter === f ? 'white' : 'text.secondary',
                      border: '1px solid', borderColor: filter === f ? 'primary.main' : 'divider',
                      '&:hover': { bgcolor: filter === f ? 'primary.main' : 'action.hover' }
                    }}
                  />
                ))}
              </Stack>
            </Stack>
          </Box>

          {showTaskForm && (
            <Grow in={showTaskForm}>
              <Box sx={{ mt: -1 }}>
                <Card sx={{ borderRadius: '14px', border: '1px solid', borderColor: 'divider', p: 0.5, bgcolor: 'background.paper' }}>
                  <TaskForm addTask={addTask} />
                </Card>
              </Box>
            </Grow>
          )}

          {/* 4. COMPACT UNIFIED FEED (Refined Spacing & Badge Colors) */}
          <Card sx={{
            borderRadius: '18px', border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper',
            overflow: 'hidden', minHeight: '50vh'
          }}>
            <Box sx={{ maxHeight: '70vh', overflowY: 'auto' }}>
              <List disablePadding>
                {filteredFeed.length > 0 ? filteredFeed.map((task, idx) => (
                  <ListItem key={task.id} divider={idx < filteredFeed.length - 1} sx={{ 
                    p: 0, transition: '0.2s', '&:hover': { bgcolor: alpha(muiTheme.palette.primary.main, 0.02) }
                  }}>
                    <Box sx={{ 
                      width: '100%', 
                      px: 2.5, 
                      py: 1.5, 
                      minHeight: 78,
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '14px' 
                    }}>
                      <Checkbox
                        checked={task.completed} onChange={() => toggleComplete(task.id)}
                        sx={{ p: 0, '&.Mui-checked': { color: 'success.main' }, color: 'text.secondary' }}
                      />
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body1" sx={{ 
                          fontWeight: 800, fontSize: '1.05rem', 
                          color: task.completed ? 'text.secondary' : 'text.primary',
                          textDecoration: task.completed ? 'line-through' : 'none',
                          lineHeight: 1.2,
                          mb: 1
                        }}>
                          {task.title}
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                          <Chip 
                            label={task.category} 
                            size="small" 
                            sx={{ 
                              fontWeight: 900, 
                              borderRadius: '6px', 
                              px: '10px',
                              height: 22, 
                              fontSize: '11px', 
                              textTransform: 'uppercase',
                              bgcolor: alpha(getCategoryColor(muiTheme, task.category), 0.1),
                              color: getCategoryColor(muiTheme, task.category)
                            }} 
                          />
                          {task.priority === 'high' && (
                            <Chip label="Focus" size="small" sx={{ fontWeight: 900, borderRadius: '4px', height: 18, fontSize: '9px', bgcolor: alpha(muiTheme.palette.error.main, 0.1), color: 'error.main' }} />
                          )}
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <AccessTimeRoundedIcon sx={{ fontSize: 13 }} /> {task.time || 'Flexible'}
                          </Typography>
                        </Stack>
                      </Box>
                      <Stack direction="row" spacing={0.5} sx={{ opacity: { xs: 1, md: 0 }, '&:hover': { opacity: 1 }, transition: 'opacity 0.25s ease' }}>
                        <IconButton size="small" onClick={() => setEditingTask(task)} sx={{ color: 'primary.main' }}><EditRoundedIcon fontSize="small" /></IconButton>
                        <IconButton size="small" onClick={() => deleteTask(task.id)} sx={{ color: alpha(muiTheme.palette.error.main, 0.6), '&:hover': { color: 'error.main' } }}><DeleteOutlineRoundedIcon fontSize="small" /></IconButton>
                      </Stack>
                    </Box>
                  </ListItem>
                )) : (
                  <Box sx={{ py: 10, textAlign: 'center' }}>
                    <AutoAwesomeRoundedIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2, opacity: 0.2 }} />
                    <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.secondary' }}>Workspace Clear.</Typography>
                  </Box>
                )}
              </List>
            </Box>
          </Card>

        </Stack>
      </Container>

      {/* OVERLAYS */}
      {editingTask && <EditTaskDialog open={!!editingTask} task={editingTask} onClose={() => setEditingTask(null)} onSave={handleUpdateTask} />}
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} variant="filled" sx={{ borderRadius: '12px', fontWeight: 800, fontSize: '0.85rem' }}>{snackbar.message}</Alert>
      </Snackbar>

    </Box>
  );
}

export default Dashboard;