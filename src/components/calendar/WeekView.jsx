import React from 'react';
import { startOfWeek, endOfWeek, eachDayOfInterval, format, isToday } from 'date-fns';

const CATEGORIES = {
  work: 'bg-blue-500',
  personal: 'bg-green-500',
  important: 'bg-red-500',
  study: 'bg-purple-500',
};

function WeekView({ currentDate, tasks, onDateClick, onEventClick }) {
  const startDate = startOfWeek(currentDate);
  const endDate = endOfWeek(currentDate);
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="grid grid-cols-8 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
        <div className="py-3 px-2 border-r border-slate-200 dark:border-slate-700 flex items-center justify-center text-xs font-semibold text-slate-400">
          Time
        </div>
        {days.map(day => {
          const isCurrentDay = isToday(day);
          return (
            <div key={day.toString()} onClick={() => onDateClick(format(day, 'yyyy-MM-dd'))} className="py-3 border-r border-slate-200 dark:border-slate-700 last:border-0 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{format(day, 'EEE')}</span>
              <span className={`text-lg font-bold w-8 h-8 flex items-center justify-center rounded-full mt-1 ${isCurrentDay ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-800 dark:text-white'}`}>
                {format(day, 'd')}
              </span>
            </div>
          );
        })}
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto custom-scrollbar relative">
        <div className="grid grid-cols-8 min-h-[800px]">
          {/* Time Column */}
          <div className="border-r border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30">
            {hours.map(hour => (
              <div key={hour} className="h-16 border-b border-slate-100 dark:border-slate-700/50 flex items-start justify-center pt-2">
                <span className="text-xs font-medium text-slate-400">{hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}</span>
              </div>
            ))}
          </div>

          {/* Days Columns */}
          {days.map(day => {
            const formattedDate = format(day, "yyyy-MM-dd");
            const dayTasks = tasks.filter(t => t.date === formattedDate);
            return (
              <div key={day.toString()} className="relative border-r border-slate-200 dark:border-slate-700 last:border-0">
                {/* Grid Lines */}
                {hours.map(hour => (
                  <div key={hour} onClick={() => onDateClick(formattedDate, `${hour.toString().padStart(2, '0')}:00`)} className="h-16 border-b border-slate-100 dark:border-slate-700/50 cursor-pointer hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors border-dashed border-opacity-50"></div>
                ))}
                
                {/* Events */}
                {dayTasks.map(task => {
                  if (!task.time) return null; // Only show timed events
                  const [h, m] = task.time.split(':').map(Number);
                  const top = (h * 64) + (m / 60 * 64);
                  const durationMins = task.duration || 60;
                  const height = (durationMins / 60) * 64;
                  const color = CATEGORIES[task.category || 'work'] || CATEGORIES.work;

                  return (
                    <div
                      key={task.id}
                      onClick={(e) => { e.stopPropagation(); onEventClick(task); }}
                      style={{ top: `${top}px`, height: `${height}px` }}
                      className={`absolute left-1 right-1 rounded-md p-1.5 text-xs text-white overflow-hidden shadow-sm hover:opacity-90 transition-opacity cursor-pointer ${color} ${task.completed ? 'opacity-50' : ''}`}
                    >
                      <p className={`font-semibold truncate ${task.completed ? 'line-through' : ''}`}>{task.title}</p>
                      <p className="text-[10px] opacity-90">{task.time}</p>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default WeekView;
