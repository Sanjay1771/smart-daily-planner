import React from 'react';
import { Box, Typography, Stack, alpha, useTheme } from '@mui/material';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, format, isSameMonth, isSameDay } from 'date-fns';

function MonthView({ currentDate, selectedDate, tasks, onDateClick, onEventClick }) {
  const theme = useTheme();
  
  const getCategoryColor = (category) => {
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

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: startDate, end: endDate });
  const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const renderEvents = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayTasks = tasks.filter(t => (t.event_date || t.date) === dateStr);
    
    if (dayTasks.length === 0) return null;

    if (dayTasks.length > 2) {
      return (
        <Stack spacing={0.6} sx={{ width: '100%', mt: 1 }}>
          <Stack direction="row" spacing={0.8} sx={{ px: 1 }}>
             {dayTasks.slice(0, 3).map((t, idx) => (
               <Box key={idx} sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: getCategoryColor(t.category) }} />
             ))}
          </Stack>
          <Typography variant="caption" sx={{ fontSize: '10px', color: 'text.secondary', px: 1, fontWeight: 900 }}>
            + {dayTasks.length - 2} more
          </Typography>
        </Stack>
      );
    }

    return (
      <Stack spacing={0.6} sx={{ width: '100%', mt: 1 }}>
        {dayTasks.map((task) => (
          <Stack key={task.id} direction="row" alignItems="center" spacing={1} sx={{ px: 1 }}>
            <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: getCategoryColor(task.category), flexShrink: 0 }} />
            <Typography noWrap sx={{ fontSize: '10px', color: 'text.primary', fontWeight: 700, opacity: task.completed ? 0.4 : 0.9 }}>
              {task.title}
            </Typography>
          </Stack>
        ))}
      </Stack>
    );
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: 'background.default', transition: 'all 0.3s ease' }}>
      {/* Weekday Header */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(7, 1fr)', 
        borderBottom: '1px solid', 
        borderColor: 'divider', 
        bgcolor: 'background.paper',
        transition: 'all 0.3s ease'
      }}>
        {weekDays.map(day => (
          <Box key={day} sx={{ py: 2, borderRight: '1px solid', borderColor: 'divider', '&:last-child': { borderRight: 0 }, transition: 'all 0.3s ease' }}>
            <Typography align="center" sx={{ fontSize: '11px', fontWeight: 900, color: 'text.secondary', letterSpacing: '0.1em', opacity: 0.8 }}>
              {day}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Days Grid */}
      <Box sx={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gridAutoRows: '1fr', transition: 'all 0.3s ease' }}>
        {days.map((day, i) => {
          const isSel = isSameDay(day, selectedDate);
          const isCurrMonth = isSameMonth(day, monthStart);
          const isTdy = isSameDay(day, new Date());
          const formattedDate = format(day, "yyyy-MM-dd");

          return (
            <Box
              key={day.toString()}
              onClick={() => onDateClick(formattedDate)}
              sx={{
                borderRight: '1px solid',
                borderBottom: '1px solid',
                borderColor: 'divider',
                p: 1.5,
                cursor: 'pointer',
                position: 'relative',
                bgcolor: isSel 
                  ? (theme.palette.mode === 'dark' ? alpha(theme.palette.primary.main, 0.15) : alpha(theme.palette.primary.main, 0.04)) 
                  : isCurrMonth ? 'background.paper' : (theme.palette.mode === 'dark' ? alpha(theme.palette.background.default, 0.3) : alpha(theme.palette.background.default, 0.6)),
                boxShadow: isSel ? `inset 0 0 0 2px ${theme.palette.primary.main}` : 'none',
                zIndex: isSel ? 1 : 0,
                transition: 'all 0.2s ease-in-out',
                '&:hover': { 
                  bgcolor: isSel ? alpha(theme.palette.primary.main, 0.18) : 'action.hover',
                  zIndex: 2,
                  boxShadow: theme.palette.mode === 'dark' ? '0 0 20px rgba(0,0,0,0.5)' : '0 4px 20px rgba(0,0,0,0.05)'
                },
                '&:nth-of-type(7n)': { borderRight: 0 }
              }}
            >
              <Box sx={{
                width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px',
                bgcolor: isTdy ? 'primary.main' : 'transparent',
                color: isTdy ? 'white' : (isCurrMonth ? 'text.primary' : 'text.secondary'),
                fontSize: '13px', fontWeight: 900, mb: 1,
                opacity: isCurrMonth ? 1 : 0.4,
                transition: 'all 0.2s ease',
                boxShadow: isTdy ? `0 4px 12px ${alpha(theme.palette.primary.main, 0.4)}` : 'none'
              }}>
                {format(day, "d")}
              </Box>
              {renderEvents(day)}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

export default MonthView;
