import React from 'react';
import { format, isToday } from 'date-fns';

const CATEGORIES = {
  work: 'bg-blue-500',
  personal: 'bg-green-500',
  important: 'bg-red-500',
  study: 'bg-purple-500',
};

function DayView({ currentDate, tasks, onDateClick, onEventClick }) {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const formattedDate = format(currentDate, "yyyy-MM-dd");
  const dayTasks = tasks.filter(t => t.date === formattedDate);
  const isCurrentDay = isToday(currentDate);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-center py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
        <div className="flex flex-col items-center">
          <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{format(currentDate, 'EEEE')}</span>
          <span className={`text-2xl font-bold w-12 h-12 flex items-center justify-center rounded-full mt-1 ${isCurrentDay ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-800 dark:text-white'}`}>
            {format(currentDate, 'd')}
          </span>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto custom-scrollbar relative">
        <div className="flex min-h-[1200px]">
          {/* Time Column */}
          <div className="w-20 flex-shrink-0 border-r border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30">
            {hours.map(hour => (
              <div key={hour} className="h-20 border-b border-slate-100 dark:border-slate-700/50 flex items-start justify-center pt-2">
                <span className="text-sm font-medium text-slate-400">{hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}</span>
              </div>
            ))}
          </div>

          {/* Day Column */}
          <div className="flex-1 relative">
            {/* Grid Lines */}
            {hours.map(hour => (
              <div key={hour} onClick={() => onDateClick(formattedDate, `${hour.toString().padStart(2, '0')}:00`)} className="h-20 border-b border-slate-100 dark:border-slate-700/50 cursor-pointer hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors border-dashed border-opacity-50"></div>
            ))}
            
            {/* Events */}
            {dayTasks.map(task => {
              if (!task.time) return null;
              const [h, m] = task.time.split(':').map(Number);
              const top = (h * 80) + (m / 60 * 80);
              const durationMins = task.duration || 60;
              const height = (durationMins / 60) * 80;
              const color = CATEGORIES[task.category || 'work'] || CATEGORIES.work;

              return (
                <div
                  key={task.id}
                  onClick={(e) => { e.stopPropagation(); onEventClick(task); }}
                  style={{ top: `${top}px`, height: `${height}px` }}
                  className={`absolute left-2 right-4 rounded-xl p-3 text-sm text-white overflow-hidden shadow-md hover:shadow-lg hover:scale-[1.01] transition-all cursor-pointer border border-white/20 ${color} ${task.completed ? 'opacity-50' : ''}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className={`font-bold truncate ${task.completed ? 'line-through' : ''}`}>{task.title}</p>
                    <p className="text-xs font-medium opacity-90">{task.time}</p>
                  </div>
                  {task.duration && <p className="text-xs opacity-80">{task.duration} mins</p>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DayView;
