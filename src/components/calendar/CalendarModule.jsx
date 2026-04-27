import React, { useState, useMemo } from 'react';
import { Box, Stack, Grid, Typography, alpha, useTheme } from '@mui/material';
import CalendarHeader from './CalendarHeader';
import MonthView from './MonthView';
import WeekView from './WeekView';
import DayView from './DayView';
import EventModal from './EventModal';
import AgendaPanel from './AgendaPanel';
import { supabase } from '../../supabaseClient';
import { format, startOfToday } from 'date-fns';

function CalendarModule({ tasks, setTasks, user }) {
  const theme = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(startOfToday());
  const [view, setView] = useState('month'); // 'month', 'week', 'day'
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [defaultDateForModal, setDefaultDateForModal] = useState('');

  const handleDateClick = (dateStr) => {
    setSelectedDate(new Date(dateStr));
    setEditingEvent(null);
    setDefaultDateForModal(dateStr);
  };

  const handleEventClick = (event) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const handleSaveEvent = async (eventData) => {
    try {
      if (editingEvent) {
        const { error } = await supabase
          .from('events')
          .update({
            title: eventData.title,
            event_date: eventData.date,
            start_time: eventData.time,
            category: eventData.category,
            completed: eventData.completed,
          })
          .eq('id', eventData.id);

        if (error) throw error;
        setTasks(tasks.map(t => t.id === eventData.id ? eventData : t));
      } else {
        const { data, error } = await supabase
          .from('events')
          .insert([{
            user_id: user.id,
            title: eventData.title,
            event_date: eventData.date,
            start_time: eventData.time,
            category: eventData.category,
            completed: eventData.completed ?? false,
          }])
          .select();

        if (error) throw error;

        if (data && data.length > 0) {
          const newTask = { ...data[0], date: data[0].event_date, time: data[0].start_time };
          setTasks([...tasks, newTask]);
        }
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving event:', error.message);
    }
  };

  const handleDeleteEvent = async (id) => {
    try {
      const { error } = await supabase.from('events').delete().eq('id', id);
      if (error) throw error;
      setTasks(tasks.filter(t => t.id !== id));
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error deleting event:', error.message);
    }
  };

  const selectedTasks = useMemo(() => {
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    return tasks.filter(t => (t.event_date || t.date) === dateStr).sort((a, b) => (a.start_time || '').localeCompare(b.start_time || ''));
  }, [selectedDate, tasks]);

  // Calculate Monthly Stats
  const stats = useMemo(() => {
    const currentMonth = format(currentDate, 'yyyy-MM');
    const monthTasks = tasks.filter(t => (t.event_date || t.date).startsWith(currentMonth));
    return {
      total: monthTasks.length,
      completed: monthTasks.filter(t => t.completed).length,
      pending: monthTasks.filter(t => !t.completed).length
    };
  }, [tasks, currentDate]);

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: { xs: 'column', md: 'row' },
      gap: { xs: 2, md: 3 }, 
      height: { xs: 'auto', md: 'calc(100vh - 200px)' }, 
      minHeight: { xs: '50vh', md: 'auto' },
      bgcolor: 'background.default', 
      p: 0,
      transition: 'all 0.3s ease'
    }}>
      {/* --- LEFT: CALENDAR COLUMN --- */}
      <Box sx={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        minWidth: 0,
        transition: 'all 0.3s ease'
      }}>
        <CalendarHeader
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
          view={view}
          setView={setView}
        />

        <Box sx={{ 
          flex: 1, 
          overflow: 'hidden', 
          borderRadius: '16px', 
          border: theme.palette.mode === 'dark' ? '1px solid rgba(255,255,255,0.03)' : '1px solid rgba(0,0,0,0.05)', 
          bgcolor: theme.palette.mode === 'dark' ? 'rgba(10,10,14,0.95)' : 'background.paper',
          transition: 'all 0.3s ease',
          boxShadow: theme.palette.mode === 'dark' ? '0 8px 40px rgba(0,0,0,0.6)' : '0 4px 24px rgba(0,0,0,0.04)'
        }}>
          {view === 'month' && (
            <MonthView
              currentDate={currentDate}
              selectedDate={selectedDate}
              tasks={tasks}
              onDateClick={handleDateClick}
              onEventClick={handleEventClick}
            />
          )}
          {view === 'week' && (
            <WeekView
              currentDate={currentDate}
              tasks={tasks}
              onDateClick={handleDateClick}
              onEventClick={handleEventClick}
            />
          )}
          {view === 'day' && (
            <DayView
              currentDate={currentDate}
              tasks={tasks}
              onDateClick={handleDateClick}
              onEventClick={handleEventClick}
            />
          )}
        </Box>
      </Box>

      {/* --- RIGHT: AGENDA PANEL --- */}
      <AgendaPanel
        selectedDate={selectedDate}
        tasks={selectedTasks}
        stats={stats}
        onAddTask={() => {
          setDefaultDateForModal(format(selectedDate, 'yyyy-MM-dd'));
          setEditingEvent(null);
          setIsModalOpen(true);
        }}
        onEditTask={handleEventClick}
        onDeleteTask={handleDeleteEvent}
        onToggleTask={async (task) => {
           const { error } = await supabase.from('events').update({ completed: !task.completed }).eq('id', task.id);
           if (!error) setTasks(tasks.map(t => t.id === task.id ? { ...t, completed: !task.completed } : t));
        }}
      />

      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
        initialData={editingEvent}
        defaultDate={defaultDateForModal}
      />
    </Box>
  );
}

export default CalendarModule;
