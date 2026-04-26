import React from 'react';
import CalendarModule from './calendar/CalendarModule';

/**
 * CalendarView is a high-level wrapper around the CalendarModule
 * providing a full-page monthly calendar experience.
 */
function CalendarView({ tasks, user, onRefresh }) {
  return (
    <CalendarModule 
      tasks={tasks} 
      user={user} 
      onRefresh={onRefresh} 
    />
  );
}

export default CalendarView;
