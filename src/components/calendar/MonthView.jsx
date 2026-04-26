import React from 'react';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, format, isSameMonth, isToday } from 'date-fns';

const CATEGORIES = {
  work: 'bg-blue-500',
  personal: 'bg-green-500',
  important: 'bg-red-500',
  study: 'bg-purple-500',
};

function MonthView({ currentDate, tasks, onDateClick, onEventClick }) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const dateFormat = "d";
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
      {/* Weekday Header */}
      <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
        {weekDays.map(day => (
          <div key={day} className="py-3 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="flex-1 grid grid-cols-7 grid-rows-5 lg:grid-rows-auto">
        {days.map((day, i) => {
          const formattedDate = format(day, "yyyy-MM-dd");
          const dayTasks = tasks.filter(t => t.date === formattedDate).sort((a, b) => a.time.localeCompare(b.time));
          const isCurrentMonth = isSameMonth(day, monthStart);
          const isCurrentDay = isToday(day);

          return (
            <div 
              key={day.toString()} 
              onClick={() => onDateClick(formattedDate)}
              className={`min-h-[100px] lg:min-h-[120px] p-1.5 sm:p-2 border-r border-b border-slate-100 dark:border-slate-700/50 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/30 cursor-pointer ${
                !isCurrentMonth ? 'bg-slate-50/50 dark:bg-slate-800/30 text-slate-400 dark:text-slate-600' : 'text-slate-700 dark:text-slate-200'
              } ${(i + 1) % 7 === 0 ? 'border-r-0' : ''}`}
            >
              {/* Day Number */}
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs sm:text-sm font-semibold flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full ${
                  isCurrentDay ? 'bg-blue-600 text-white shadow-sm' : ''
                }`}>
                  {format(day, dateFormat)}
                </span>
                {dayTasks.length > 0 && (
                  <span className="lg:hidden text-[10px] font-medium text-slate-400">{dayTasks.length} events</span>
                )}
              </div>

              {/* Events */}
              <div className="hidden lg:flex flex-col gap-1 overflow-y-auto max-h-[80px] custom-scrollbar">
                {dayTasks.slice(0, 3).map(task => {
                  const color = CATEGORIES[task.category || 'work'] || CATEGORIES.work;
                  return (
                    <div
                      key={task.id}
                      onClick={(e) => { e.stopPropagation(); onEventClick(task); }}
                      className={`px-2 py-1 text-xs rounded truncate transition-all duration-200 hover:opacity-80 text-white ${color} ${task.completed ? 'opacity-50 line-through' : ''}`}
                      title={task.title}
                    >
                      {task.time && <span className="font-semibold mr-1">{task.time}</span>}
                      {task.title}
                    </div>
                  );
                })}
                {dayTasks.length > 3 && (
                  <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 pl-1">
                    + {dayTasks.length - 3} more
                  </div>
                )}
              </div>
              
              {/* Mobile Dots */}
              <div className="flex lg:hidden flex-wrap gap-1 mt-1">
                {dayTasks.map(task => {
                  const color = CATEGORIES[task.category || 'work'] || CATEGORIES.work;
                  return <div key={task.id} className={`w-2 h-2 rounded-full ${color}`}></div>;
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MonthView;
