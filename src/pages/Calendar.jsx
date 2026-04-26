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
    backgroundColor: alpha(theme.palette.background.paper, 0.6),
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: '24px',
    backgroundImage: 'none',
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
    <Box sx={{ bgcolor: 'background.default', minHeight: '100%', color: 'text.primary', p: { xs: 1, md: 2 }, fontFamily: '"SF Pro Display", "Inter", sans-serif' }}>
      <Container maxWidth="xl" sx={{ height: 'calc(100vh - 64px)' }}>
        <Grid container spacing={4} sx={{ height: '100%' }}>
          
          {/* --- LEFT SIDEBAR (20%) --- */}
          <Grid item xs={12} md={2.4} sx={{ display: { xs: 'none', md: 'block' } }}>
            <Stack spacing={4}>
              <Box sx={{ px: 1 }}>
                <Typography variant="h5" sx={{ fontWeight: 900, color: 'primary.main', letterSpacing: '-0.03em' }}>PlanPro</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 800, letterSpacing: '0.05em' }}>SMART DAILY PLANNER</Typography>
              </Box>

              <Box sx={{ ...glassCard, p: 2.5 }}>
                <Typography variant="caption" sx={{ fontWeight: 900, color: 'text.secondary', letterSpacing: '0.1em', mb: 2, display: 'block' }}>CALENDAR</Typography>
                <Grid container spacing={0.5}>
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d) => (
                    <Grid item xs={1.71} key={d}><Typography align="center" sx={{ fontSize: '10px', fontWeight: 900, color: alpha(theme.palette.text.secondary, 0.6) }}>{d}</Typography></Grid>
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
                            height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', borderRadius: '50%', fontSize: '11px', fontWeight: 800,
                            bgcolor: isTdy ? 'primary.main' : (isSel ? alpha(theme.palette.primary.main, 0.2) : 'transparent'),
                            color: isTdy ? 'white' : (isCurr ? 'text.primary' : alpha(theme.palette.text.primary, 0.2)),
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
                  borderRadius: '16px', bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', fontWeight: 800, textTransform: 'none', py: 1.8,
                  '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) }
                }}
              >
                Go to Today
              </Button>
            </Stack>
          </Grid>

          {/* --- CENTER MAIN PANEL (55%) --- */}
          <Grid item xs={12} md={6.6}>
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {/* Toolbar Refined */}
              <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4} sx={{ px: 1 }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Stack direction="row" spacing={1} sx={{ bgcolor: 'background.paper', p: 0.8, borderRadius: '14px', border: `1px solid ${theme.palette.divider}` }}>
                    <IconButton size="small" onClick={() => setViewDate(subMonths(viewDate, 1))} sx={{ color: 'text.primary' }}><ChevronLeftRoundedIcon fontSize="small" /></IconButton>
                    <IconButton size="small" onClick={() => setViewDate(addMonths(viewDate, 1))} sx={{ color: 'text.primary' }}><ChevronRightRoundedIcon fontSize="small" /></IconButton>
                  </Stack>
                  <Button 
                    onClick={goToToday}
                    sx={{ color: 'text.primary', fontWeight: 700, textTransform: 'none', borderRadius: '12px', px: 2.5, height: 44, border: `1px solid ${theme.palette.divider}` }}
                  >
                    Today
                  </Button>
                </Stack>

                <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: '-0.04em', color: 'text.primary' }}>
                  {format(viewDate, 'MMMM')} <span style={{ color: alpha(theme.palette.text.primary, 0.4) }}>{format(viewDate, 'yyyy')}</span>
                </Typography>

                <Stack direction="row" spacing={0.5} sx={{ bgcolor: 'background.paper', p: 0.8, borderRadius: '16px', border: `1px solid ${theme.palette.divider}` }}>
                  {['Month', 'Week', 'Day'].map((mode) => (
                    <Button
                      key={mode}
                      onClick={() => setViewMode(mode)}
                      sx={{
                        textTransform: 'none', px: 2.5, py: 0.8, borderRadius: '10px', fontWeight: 800, fontSize: '0.85rem',
                        color: viewMode === mode ? 'text.primary' : 'text.secondary',
                        bgcolor: viewMode === mode ? alpha(theme.palette.primary.main, 0.15) : 'transparent',
                        '&:hover': { bgcolor: viewMode === mode ? alpha(theme.palette.primary.main, 0.2) : alpha(theme.palette.text.secondary, 0.05) }
                      }}
                    >
                      {mode}
                    </Button>
                  ))}
                </Stack>
              </Stack>

              {/* Grid Refined */}
              <Box sx={{ 
                flex: 1, display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gridAutoRows: '1fr', borderRadius: '32px', overflow: 'hidden', border: `1px solid ${theme.palette.divider}`, bgcolor: 'background.paper'
              }}>
                {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day) => (
                  <Box key={day} sx={{ py: 2.5, borderBottom: `1px solid ${theme.palette.divider}`, bgcolor: alpha(theme.palette.background.default, 0.4) }}>
                    <Typography align="center" sx={{ fontSize: '11px', fontWeight: 900, color: 'text.secondary', letterSpacing: '0.12em' }}>{day}</Typography>
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
                        borderRight: `1px solid ${theme.palette.divider}`, borderBottom: `1px solid ${theme.palette.divider}`, p: 1.5, cursor: 'pointer', position: 'relative',
                        bgcolor: isSel ? alpha(theme.palette.primary.main, 0.06) : 'transparent', opacity: isCurr ? 1 : 0.25,
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
            <Stack spacing={3} sx={{ height: '100%' }}>
              <Card sx={{ ...glassCard, flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ p: 4, pb: 0 }}>
                  <Typography variant="h5" sx={{ fontWeight: 900, mb: 0.5, letterSpacing: '-0.02em' }}>{format(selectedDate, 'EEEE')}</Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 800 }}>{format(selectedDate, 'MMMM d, yyyy')}</Typography>
                  <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 900, mt: 1.5, display: 'block' }}>SELECTED DATE</Typography>
                </Box>

                <Box sx={{ flex: 1, overflowY: 'auto', px: 3, py: 4 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 900, fontSize: '0.8rem', color: 'text.secondary' }}>TASKS</Typography>
                    <Button 
                      startIcon={<AddRoundedIcon sx={{ fontSize: 16 }} />} 
                      onClick={() => setShowAddModal(true)}
                      sx={{ textTransform: 'none', color: 'primary.main', fontWeight: 800, fontSize: '0.8rem', bgcolor: alpha(theme.palette.primary.main, 0.1), borderRadius: '12px', px: 2 }}
                    >
                      Add
                    </Button>
                  </Stack>

                  <Stack spacing={2}>
                    {selectedTasks.length > 0 ? (
                      selectedTasks.map((task) => (
                        <Box key={task.id} sx={{ p: 2, borderRadius: '18px', bgcolor: alpha(theme.palette.text.primary, 0.03), border: `1px solid ${theme.palette.divider}`, opacity: task.completed ? 0.6 : 1 }}>
                          <Stack direction="row" spacing={2} alignItems="center">
                            <Checkbox checked={task.completed} onChange={() => toggleComplete(task.id, task.completed)} sx={{ p: 0, color: 'text.secondary', '&.Mui-checked': { color: theme.palette.success.main } }} />
                            <Box sx={{ flex: 1 }}>
                              <Typography sx={{ fontWeight: 800, fontSize: '0.9rem', textDecoration: task.completed ? 'line-through' : 'none' }}>{task.title}</Typography>
                              <Stack direction="row" spacing={1.5} alignItems="center" mt={0.5}>
                                <AccessTimeRoundedIcon sx={{ fontSize: 12, color: 'text.secondary' }} />
                                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>{task.start_time || 'All Day'}</Typography>
                                <Box sx={{ px: 0.8, py: 0.2, borderRadius: '4px', bgcolor: alpha(getCategoryColor(theme, task.category), 0.15), color: getCategoryColor(theme, task.category), fontSize: '8px', fontWeight: 900, textTransform: 'uppercase' }}>{task.category}</Box>
                              </Stack>
                            </Box>
                            <IconButton onClick={() => deleteTask(task.id)} size="small" sx={{ color: alpha(theme.palette.error.main, 0.4), '&:hover': { color: theme.palette.error.main } }}><DeleteOutlineRoundedIcon fontSize="small" /></IconButton>
                          </Stack>
                        </Box>
                      ))
                    ) : (
                      <Box sx={{ textAlign: 'center', py: 6, opacity: 0.2 }}><Typography variant="body2" sx={{ fontWeight: 800 }}>No tasks scheduled</Typography></Box>
                    )}
                  </Stack>
                </Box>

                {/* Rearranged Stats & Quote into Right Sidebar */}
                <Box sx={{ p: 3, pt: 0 }}>
                  <Card sx={{ p: 2, borderRadius: '18px', bgcolor: alpha(theme.palette.text.primary, 0.03), border: `1px solid ${theme.palette.divider}`, mb: 2 }}>
                    <Stack direction="row" justifyContent="space-around">
                      <Box sx={{ textAlign: 'center' }}><Typography variant="body2" sx={{ fontWeight: 900 }}>{stats.total}</Typography><Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 800, fontSize: '0.65rem' }}>TOTAL</Typography></Box>
                      <Box sx={{ textAlign: 'center' }}><Typography variant="body2" sx={{ fontWeight: 900, color: theme.palette.success.main }}>{stats.completed}</Typography><Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 800, fontSize: '0.65rem' }}>DONE</Typography></Box>
                      <Box sx={{ textAlign: 'center' }}><Typography variant="body2" sx={{ fontWeight: 900, color: theme.palette.warning.main }}>{stats.pending}</Typography><Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 800, fontSize: '0.65rem' }}>PENDING</Typography></Box>
                    </Stack>
                  </Card>

                  <Box sx={{ 
                    p: 2, borderRadius: '18px', 
                    background: theme.palette.mode === 'dark' 
                      ? 'linear-gradient(135deg, #2D1B69 0%, #1A1F26 100%)' 
                      : `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`, 
                    textAlign: 'center', border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
                  }}>
                    <Typography variant="body2" sx={{ fontWeight: 800, fontSize: '0.8rem', mb: 0.5 }}>"Small progress leads to results."</Typography>
                    <Typography variant="caption" sx={{ color: alpha(theme.palette.text.secondary, 0.8), fontWeight: 700, fontSize: '0.7rem' }}>Stay consistent. Stay successful.</Typography>
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
