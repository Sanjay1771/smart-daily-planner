import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Typography,
  Stack,
  Grid,
  Card,
  Checkbox,
  IconButton,
  alpha,
  useTheme,
  Button,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  Snackbar,
  Alert,
} from '@mui/material';

// Icons
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import TodayRoundedIcon from '@mui/icons-material/TodayRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import PendingActionsRoundedIcon from '@mui/icons-material/PendingActionsRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';

import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  isToday, 
  startOfToday
} from 'date-fns';
import { supabase } from '../supabaseClient';

// Components
import TaskForm from '../components/TaskForm';
import EditTaskDialog from '../components/EditTaskDialog';

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

const Calendar = ({ user }) => {
  const theme = useTheme();
  
  const glassCard = {
    backdropFilter: 'blur(24px)',
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(14,14,18,0.9)' : alpha(theme.palette.background.paper, 0.6),
    border: theme.palette.mode === 'dark' ? '1px solid rgba(255,255,255,0.03)' : `1px solid ${alpha(theme.palette.divider, 0.3)}`,
    borderRadius: '16px',
    backgroundImage: 'none',
    boxShadow: theme.palette.mode === 'light' ? '0 4px 24px rgba(0,0,0,0.04)' : '0 8px 40px rgba(0,0,0,0.5)',
  };

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(startOfToday());
  const [viewMode, setViewMode] = useState('Month');
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const showSnackbar = (message, severity = 'success') => setSnackbar({ open: true, message, severity });

  // --- SUPABASE LOGIC ---
  const fetchTasks = useCallback(async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('user_id', user.id);
      if (error) throw error;
      setTasks(data || []);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleAddTask = async (taskData) => {
    try {
      const { error } = await supabase.from('events').insert([{
        user_id: user.id,
        title: taskData.title,
        event_date: taskData.date,
        start_time: taskData.time,
        category: taskData.category || 'WORK',
        completed: false
      }]);
      if (error) throw error;
      showSnackbar('Task added');
      setShowAddModal(false);
      fetchTasks();
    } catch (err) {
      showSnackbar(err.message, 'error');
    }
  };

  const handleUpdateTask = async (updatedTask) => {
    try {
      const { error } = await supabase.from('events').update({
        title: updatedTask.title,
        event_date: updatedTask.date,
        start_time: updatedTask.time,
        category: updatedTask.category,
        completed: updatedTask.completed,
      }).eq('id', updatedTask.id);
      if (error) throw error;
      showSnackbar('Task updated');
      setEditingTask(null);
      fetchTasks();
    } catch (err) {
      showSnackbar(err.message, 'error');
    }
  };

  const toggleComplete = async (id, currentStatus) => {
    try {
      const { error } = await supabase.from('events').update({ completed: !currentStatus }).eq('id', id);
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
      showSnackbar('Task removed');
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  // --- CALENDAR LOGIC ---
  const monthDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(viewDate));
    const end = endOfWeek(endOfMonth(viewDate));
    return eachDayOfInterval({ start, end });
  }, [viewDate]);

  const selectedTasks = useMemo(() => {
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    return tasks.filter(t => (t.event_date || t.date) === dateStr);
  }, [selectedDate, tasks]);

  const stats = useMemo(() => {
    const currentMonth = format(viewDate, 'yyyy-MM');
    const monthTasks = tasks.filter(t => (t.event_date || t.date).startsWith(currentMonth));
    return {
      total: monthTasks.length,
      completed: monthTasks.filter(t => t.completed).length,
      pending: monthTasks.filter(t => !t.completed).length
    };
  }, [tasks, viewDate]);

  const goToToday = () => {
    const today = startOfToday();
    setViewDate(today);
    setSelectedDate(today);
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100%', color: 'text.primary', p: { xs: 1.5, md: 3 }, fontFamily: '"SF Pro Display", "Inter", sans-serif' }}>
      <Container maxWidth="xl" sx={{ height: { xs: 'auto', md: 'calc(100vh - 64px)' }, py: { xs: 1, md: 2 } }}>
        <Grid container spacing={{ xs: 2, md: 3 }} sx={{ height: { xs: 'auto', md: '100%' } }}>
          
          {/* --- LEFT SIDEBAR (20%) --- */}
          <Grid item xs={12} md={2.4} sx={{ display: { xs: 'none', md: 'block' } }}>
            <Stack spacing={3} sx={{ pt: 1 }}>
              <Box sx={{ px: 0.5 }}>
                <Typography variant="h6" sx={{ fontWeight: 900, color: 'primary.main', letterSpacing: '-0.03em' }}>PlanPro</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 800, letterSpacing: '0.05em', fontSize: '0.6rem' }}>SMART DAILY PLANNER</Typography>
              </Box>

              <Box sx={{ ...glassCard, p: 2.5, borderRadius: '20px' }}>
                <Typography variant="caption" sx={{ fontWeight: 900, color: 'text.secondary', letterSpacing: '0.08em', mb: 1.5, display: 'block', fontSize: '0.6rem' }}>CALENDAR</Typography>
                <Grid container spacing={0.5}>
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d) => (
                    <Grid item xs={1.71} key={d}><Typography align="center" sx={{ fontSize: '9px', fontWeight: 900, color: alpha(theme.palette.text.secondary, 0.5) }}>{d}</Typography></Grid>
                  ))}
                  {monthDays.slice(0, 42).map((day, i) => {
                    const isTdy = isToday(day);
                    const isSel = isSameDay(day, selectedDate);
                    const isCurr = isSameMonth(day, viewDate);
                    return (
                      <Grid item xs={1.71} key={i}>
                        <Box
                          onClick={() => { setSelectedDate(day); setViewDate(day); }}
                          sx={{
                            height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', borderRadius: '50%', fontSize: '10px', fontWeight: 800,
                            bgcolor: isTdy ? 'primary.main' : (isSel ? alpha(theme.palette.primary.main, 0.15) : 'transparent'),
                            color: isTdy ? 'white' : (isCurr ? 'text.primary' : alpha(theme.palette.text.primary, 0.2)),
                            transition: 'all 0.15s ease',
                            '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.1) }
                          }}
                        >
                          {format(day, 'd')}
                        </Box>
                      </Grid>
                    );
                  })}
                </Grid>
              </Box>

              <Button
                fullWidth
                variant="contained"
                startIcon={<TodayRoundedIcon />}
                onClick={goToToday}
                sx={{ 
                  borderRadius: '14px', bgcolor: alpha(theme.palette.primary.main, 0.08), color: 'primary.main', fontWeight: 800, textTransform: 'none', py: 1.5,
                  boxShadow: 'none',
                  '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.15), boxShadow: 'none' }
                }}
              >
                Go to Today
              </Button>
            </Stack>
          </Grid>

          {/* --- CENTER MAIN PANEL (55%) --- */}
          <Grid item xs={12} md={6.6}>
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', pt: { xs: 0.5, md: 1 } }}>
              {/* Toolbar — Perfectly Aligned */}
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: { xs: 2, md: 3 }, px: 0.5, flexWrap: 'wrap', gap: 1.5 }}>
                {/* Left: Nav + Today + Month Title */}
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Stack direction="row" spacing={0.5} sx={{ bgcolor: 'background.paper', p: 0.6, borderRadius: '12px', border: `1px solid ${theme.palette.divider}` }}>
                    <IconButton size="small" onClick={() => setViewDate(subMonths(viewDate, 1))} sx={{ color: 'text.primary', '&:hover': { bgcolor: 'action.hover' } }}><ChevronLeftRoundedIcon sx={{ fontSize: 20 }} /></IconButton>
                    <IconButton size="small" onClick={() => setViewDate(addMonths(viewDate, 1))} sx={{ color: 'text.primary', '&:hover': { bgcolor: 'action.hover' } }}><ChevronRightRoundedIcon sx={{ fontSize: 20 }} /></IconButton>
                  </Stack>
                  <Button 
                    onClick={goToToday}
                    sx={{ color: 'text.primary', fontWeight: 700, textTransform: 'none', borderRadius: '10px', px: { xs: 1.5, md: 2 }, height: 36, fontSize: '0.8rem', border: `1px solid ${theme.palette.divider}`, '&:hover': { bgcolor: 'action.hover' } }}
                  >
                    Today
                  </Button>
                  <Typography sx={{ fontWeight: 900, letterSpacing: '-0.03em', color: 'text.primary', fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' }, whiteSpace: 'nowrap' }}>
                    {format(viewDate, 'MMMM')} <span style={{ color: alpha(theme.palette.text.primary, 0.35), fontWeight: 700 }}>{format(viewDate, 'yyyy')}</span>
                  </Typography>
                </Stack>

                {/* Right: View Mode Tabs */}
                <Stack direction="row" spacing={0.5} sx={{ bgcolor: 'background.paper', p: 0.5, borderRadius: '12px', border: `1px solid ${theme.palette.divider}` }}>
                  {['Month', 'Week', 'Day'].map((mode) => (
                    <Button
                      key={mode}
                      onClick={() => setViewMode(mode)}
                      sx={{
                        textTransform: 'none', px: { xs: 1.5, md: 2 }, py: 0.6, borderRadius: '8px', fontWeight: 800, fontSize: { xs: '0.75rem', sm: '0.8rem' },
                        minWidth: { xs: '48px', md: '64px' },
                        color: viewMode === mode ? 'primary.main' : 'text.secondary',
                        bgcolor: viewMode === mode ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                        '&:hover': { bgcolor: viewMode === mode ? alpha(theme.palette.primary.main, 0.15) : 'action.hover' }
                      }}
                    >
                      {mode}
                    </Button>
                  ))}
                </Stack>
              </Stack>

              {/* Calendar Grid */}
              <Box sx={{ 
                flex: 1, display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gridAutoRows: '1fr', 
                borderRadius: { xs: '12px', md: '16px' }, overflow: 'hidden', 
                border: theme.palette.mode === 'dark' ? '1px solid rgba(255,255,255,0.03)' : '1px solid rgba(0,0,0,0.05)', 
                bgcolor: theme.palette.mode === 'dark' ? 'rgba(10,10,14,1)' : 'background.paper',
                boxShadow: theme.palette.mode === 'dark' ? '0 8px 40px rgba(0,0,0,0.5)' : '0 4px 24px rgba(0,0,0,0.04)'
              }}>
                {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day) => (
                  <Box key={day} sx={{ py: 2, borderBottom: theme.palette.mode === 'dark' ? '1px solid rgba(255,255,255,0.06)' : `1px solid ${theme.palette.divider}`, bgcolor: theme.palette.mode === 'dark' ? 'rgba(16,16,20,0.9)' : alpha(theme.palette.background.default, 0.3) }}>
                    <Typography align="center" sx={{ fontSize: '10px', fontWeight: 900, color: 'text.secondary', letterSpacing: '0.1em' }}>{day}</Typography>
                  </Box>
                ))}
                {monthDays.map((day, idx) => {
                  const isTdy = isToday(day);
                  const isSel = isSameDay(day, selectedDate);
                  const isCurr = isSameMonth(day, viewDate);
                  const dayTasks = tasks.filter(t => (t.event_date || t.date) === format(day, 'yyyy-MM-dd'));
                  
                  return (
                    <Box
                      key={idx}
                      component={motion.div}
                      whileHover={{ bgcolor: alpha(theme.palette.text.primary, 0.02) }}
                      onClick={() => setSelectedDate(day)}
                      sx={{
                        borderRight: theme.palette.mode === 'dark' ? '1px solid rgba(255,255,255,0.04)' : `1px solid ${theme.palette.divider}`, 
                        borderBottom: theme.palette.mode === 'dark' ? '1px solid rgba(255,255,255,0.04)' : `1px solid ${theme.palette.divider}`, 
                        p: 1.5, cursor: 'pointer', position: 'relative',
                        bgcolor: isSel 
                          ? alpha(theme.palette.primary.main, 0.08) 
                          : (isCurr 
                            ? (theme.palette.mode === 'dark' ? 'rgba(12,12,16,1)' : 'transparent') 
                            : (theme.palette.mode === 'dark' ? 'rgba(8,8,10,1)' : 'transparent')), 
                        opacity: isCurr ? 1 : 0.3,
                        boxShadow: isSel ? `inset 0 0 0 2px ${theme.palette.primary.main}` : 'none', zIndex: isSel ? 1 : 0, transition: 'all 0.2s ease',
                      }}
                    >
                      <Box sx={{
                        width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', mb: 1.5,
                        bgcolor: isTdy ? 'primary.main' : 'transparent', color: isTdy ? 'white' : 'text.primary',
                        boxShadow: isTdy ? `0 4px 10px ${alpha(theme.palette.primary.main, 0.4)}` : 'none',
                        fontSize: '13px', fontWeight: 900
                      }}>
                        {format(day, 'd')}
                      </Box>
                      
                      <Stack spacing={0.6} sx={{ width: '100%' }}>
                        {dayTasks.slice(0, 2).map((t) => (
                          <Stack key={t.id} direction="row" alignItems="center" spacing={1} sx={{ px: 0.5 }}>
                            <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: getCategoryColor(theme, t.category), flexShrink: 0 }} />
                            <Typography noWrap sx={{ fontSize: '10px', color: 'text.primary', fontWeight: 700, opacity: t.completed ? 0.4 : 0.9 }}>{t.title}</Typography>
                          </Stack>
                        ))}
                        {dayTasks.length > 2 && <Typography variant="caption" sx={{ fontSize: '9px', color: 'text.secondary', px: 1, fontWeight: 900 }}>+ {dayTasks.length - 2} more</Typography>}
                      </Stack>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          </Grid>

          {/* --- RIGHT SIDEBAR (30%) --- */}
          <Grid item xs={12} md={3}>
            <Stack spacing={2.5} sx={{ height: '100%', pt: { xs: 0, md: 1 } }}>
              <Card sx={{ ...glassCard, flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                {/* Date Header */}
                <Box sx={{ px: 3, pt: 3, pb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 1.2 }}>{format(selectedDate, 'EEEE')}</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 700, mt: 0.5 }}>{format(selectedDate, 'MMMM d, yyyy')}</Typography>
                  <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 900, mt: 1, display: 'block', letterSpacing: '0.08em', fontSize: '0.6rem' }}>SELECTED DATE</Typography>
                </Box>

                {/* Tasks Section */}
                <Box sx={{ flex: 1, overflowY: 'auto', px: 3, pb: 2 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Typography variant="caption" sx={{ fontWeight: 900, fontSize: '0.7rem', color: 'text.secondary', letterSpacing: '0.08em' }}>TASKS</Typography>
                    <Button 
                      startIcon={<AddRoundedIcon sx={{ fontSize: 14 }} />} 
                      onClick={() => setShowAddModal(true)}
                      sx={{ textTransform: 'none', color: 'primary.main', fontWeight: 800, fontSize: '0.75rem', bgcolor: alpha(theme.palette.primary.main, 0.08), borderRadius: '10px', px: 1.5, py: 0.4, minHeight: 30, '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.15) } }}
                    >
                      Add
                    </Button>
                  </Stack>

                  <Stack spacing={1.5}>
                    {selectedTasks.length > 0 ? (
                      selectedTasks.map((task) => (
                        <Box key={task.id} sx={{ 
                          p: 1.5, borderRadius: '12px', 
                          bgcolor: alpha(theme.palette.text.primary, 0.02), 
                          border: theme.palette.mode === 'dark' ? '1px solid rgba(255,255,255,0.04)' : `1px solid ${theme.palette.divider}`, 
                          opacity: task.completed ? 0.5 : 1,
                          transition: 'all 0.2s ease',
                          '&:hover': { borderColor: alpha(theme.palette.primary.main, 0.2), bgcolor: alpha(theme.palette.primary.main, 0.02) }
                        }}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            {/* Checkbox - left */}
                            <Checkbox 
                              checked={task.completed} 
                              onChange={() => toggleComplete(task.id, task.completed)} 
                              sx={{ p: 0, color: 'text.disabled', '&.Mui-checked': { color: theme.palette.success.main } }} 
                              size="small"
                            />
                            {/* Title + Time - center */}
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Typography noWrap sx={{ fontWeight: 800, fontSize: '0.82rem', textDecoration: task.completed ? 'line-through' : 'none', lineHeight: 1.3 }}>{task.title}</Typography>
                              <Stack direction="row" spacing={0.8} alignItems="center" sx={{ mt: 0.4 }}>
                                <AccessTimeRoundedIcon sx={{ fontSize: 10, color: 'text.disabled' }} />
                                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.65rem' }}>{task.start_time || 'All Day'}</Typography>
                              </Stack>
                            </Box>
                            {/* Category badge */}
                            <Box sx={{ 
                              px: 0.6, py: 0.1, borderRadius: '4px', flexShrink: 0,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              bgcolor: alpha(getCategoryColor(theme, task.category), 0.08), 
                              color: getCategoryColor(theme, task.category), 
                              fontSize: '0.45rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.04em', lineHeight: 1
                            }}>
                              {task.category}
                            </Box>
                            {/* Edit icon */}
                            <IconButton 
                              onClick={() => setShowAddModal(true)} 
                              size="small" 
                              sx={{ color: 'text.disabled', p: 0.4, transition: 'all 0.2s ease', '&:hover': { color: theme.palette.primary.main, bgcolor: alpha(theme.palette.primary.main, 0.08) } }}
                            >
                              <EditRoundedIcon sx={{ fontSize: 15 }} />
                            </IconButton>
                            {/* Delete icon */}
                            <IconButton 
                              onClick={() => deleteTask(task.id)} 
                              size="small" 
                              sx={{ color: 'text.disabled', p: 0.4, transition: 'all 0.2s ease', '&:hover': { color: theme.palette.error.main, bgcolor: alpha(theme.palette.error.main, 0.08) } }}
                            >
                              <DeleteOutlineRoundedIcon sx={{ fontSize: 15 }} />
                            </IconButton>
                          </Stack>
                        </Box>
                      ))
                    ) : (
                      <Box sx={{ textAlign: 'center', py: 5, opacity: 0.3 }}>
                        <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.8rem' }}>No tasks scheduled</Typography>
                      </Box>
                    )}
                  </Stack>
                </Box>

                {/* Stats Card — 3 Equal Columns */}
                <Box sx={{ px: 3, pb: 2 }}>
                  <Box sx={{ 
                    p: 2, borderRadius: '14px', 
                    bgcolor: alpha(theme.palette.text.primary, 0.02), 
                    border: `1px solid ${theme.palette.divider}` 
                  }}>
                    <Stack direction="row" sx={{ '& > *': { flex: 1, textAlign: 'center' } }}>
                      <Box>
                        <Typography sx={{ fontWeight: 900, fontSize: '1.25rem', lineHeight: 1.2 }}>{stats.total}</Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 800, fontSize: '0.6rem', letterSpacing: '0.05em', mt: 0.5, display: 'block' }}>TOTAL</Typography>
                      </Box>
                      <Box sx={{ borderLeft: `1px solid ${theme.palette.divider}`, borderRight: `1px solid ${theme.palette.divider}` }}>
                        <Typography sx={{ fontWeight: 900, fontSize: '1.25rem', lineHeight: 1.2, color: theme.palette.success.main }}>{stats.completed}</Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 800, fontSize: '0.6rem', letterSpacing: '0.05em', mt: 0.5, display: 'block' }}>DONE</Typography>
                      </Box>
                      <Box>
                        <Typography sx={{ fontWeight: 900, fontSize: '1.25rem', lineHeight: 1.2, color: theme.palette.warning.main }}>{stats.pending}</Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 800, fontSize: '0.6rem', letterSpacing: '0.05em', mt: 0.5, display: 'block' }}>PENDING</Typography>
                      </Box>
                    </Stack>
                  </Box>
                </Box>

                {/* Quote Card — Premium Glow */}
                <Box sx={{ px: 3, pb: 3 }}>
                  <Box sx={{ 
                    p: 2.5, borderRadius: '14px', textAlign: 'center',
                    background: theme.palette.mode === 'dark' 
                      ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.15)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)` 
                      : `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.primary.main, 0.03)} 100%)`, 
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
                    boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.06)}`
                  }}>
                    <Typography sx={{ fontWeight: 800, fontSize: '0.8rem', mb: 0.5, lineHeight: 1.5 }}>"Small progress leads to results."</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.65rem' }}>Stay consistent. Stay successful.</Typography>
                  </Box>
                </Box>
              </Card>
            </Stack>
          </Grid>
        </Grid>
      </Container>

      <Dialog open={showAddModal} onClose={() => setShowAddModal(false)} PaperProps={{ sx: { borderRadius: '28px', bgcolor: 'background.paper', border: `1px solid ${theme.palette.divider}`, backgroundImage: 'none', maxWidth: '500px', width: '100%' } }}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 4, pt: 4 }}><Typography variant="h5" sx={{ fontWeight: 900 }}>New Task</Typography><IconButton onClick={() => setShowAddModal(false)} sx={{ color: 'text.secondary' }}><CloseRoundedIcon /></IconButton></DialogTitle>
        <DialogContent sx={{ px: 4, pb: 5 }}><TaskForm addTask={handleAddTask} initialDate={format(selectedDate, 'yyyy-MM-dd')} /></DialogContent>
      </Dialog>

      {editingTask && <EditTaskDialog open={!!editingTask} task={editingTask} onClose={() => setEditingTask(null)} onSave={handleUpdateTask} />}
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}><Alert severity={snackbar.severity} sx={{ borderRadius: '12px', fontWeight: 800 }}>{snackbar.message}</Alert></Snackbar>
    </Box>
  );
};

export default Calendar;
