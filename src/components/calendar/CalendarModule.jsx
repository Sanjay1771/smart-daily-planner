import React, { useState } from 'react';
import CalendarHeader from './CalendarHeader';
import MonthView from './MonthView';
import WeekView from './WeekView';
import DayView from './DayView';
import EventModal from './EventModal';
import { supabase } from '../../supabaseClient';

function CalendarModule({ tasks, setTasks, user }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month'); // 'month', 'week', 'day'
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [defaultDateForModal, setDefaultDateForModal] = useState('');

  const handleDateClick = (dateStr, timeStr = '') => {
    setEditingEvent(null);
    setDefaultDateForModal(dateStr);
    setIsModalOpen(true);
  };

  const handleEventClick = (event) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const handleSaveEvent = async (eventData) => {
    try {
      if (editingEvent) {
        // Update existing event in Supabase
        const { error } = await supabase
          .from('events')
          .update({
            title: eventData.title,
            event_date: eventData.date,
            start_time: eventData.time,
            duration: eventData.duration,
            category: eventData.category,
            completed: eventData.completed,
          })
          .eq('id', eventData.id);

        if (error) throw error;
        setTasks(tasks.map(t => t.id === eventData.id ? eventData : t));
      } else {
        // Insert new event into Supabase
        const { data, error } = await supabase
          .from('events')
          .insert([{
            user_id: user.id,
            title: eventData.title,
            event_date: eventData.date,
            start_time: eventData.time,
            duration: eventData.duration,
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
      alert('Failed to save event: ' + error.message);
    }
  };

  const handleDeleteEvent = async (id) => {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setTasks(tasks.filter(t => t.id !== id));
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error deleting event:', error.message);
      alert('Failed to delete event: ' + error.message);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] animate-fade-in">
      <CalendarHeader
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
        view={view}
        setView={setView}
      />

      <div className="flex-1 overflow-hidden">
        {view === 'month' && (
          <MonthView
            currentDate={currentDate}
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
      </div>

      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
        initialData={editingEvent}
        defaultDate={defaultDateForModal}
      />
    </div>
  );
}

export default CalendarModule;
