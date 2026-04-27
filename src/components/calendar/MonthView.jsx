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
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: theme.palette.mode === 'dark' ? 'rgba(10,10,14,1)' : 'background.paper' }}>
      {/* Weekday Header */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(7, 1fr)', 
        borderBottom: theme.palette.mode === 'dark' ? '1px solid rgba(255,255,255,0.06)' : '1px solid', 
        borderColor: theme.palette.mode === 'dark' ? undefined : 'divider', 
        bgcolor: theme.palette.mode === 'dark' ? 'rgba(16,16,20,0.9)' : alpha(theme.palette.background.default, 0.3),
      }}>
        {weekDays.map(day => (
          <Box key={day} sx={{ py: 1.5, borderRight: theme.palette.mode === 'dark' ? '1px solid rgba(255,255,255,0.04)' : '1px solid', borderColor: theme.palette.mode === 'dark' ? undefined : 'divider', '&:last-child': { borderRight: 0 } }}>
            <Typography align="center" sx={{ fontSize: '10px', fontWeight: 900, color: 'text.secondary', letterSpacing: '0.1em', opacity: 0.7 }}>
              {day}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Days Grid */}
      <Box sx={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gridAutoRows: '1fr' }}>
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
                borderRight: theme.palette.mode === 'dark' ? '1px solid rgba(255,255,255,0.04)' : '1px solid',
                borderBottom: theme.palette.mode === 'dark' ? '1px solid rgba(255,255,255,0.04)' : '1px solid',
                borderColor: theme.palette.mode === 'dark' ? undefined : 'divider',
                p: 1,
                cursor: 'pointer',
                position: 'relative',
                bgcolor: isSel 
                  ? alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.15 : 0.04) 
                  : isCurrMonth 
                    ? (theme.palette.mode === 'dark' ? 'rgba(12,12,16,1)' : 'background.paper') 
                    : (theme.palette.mode === 'dark' ? 'rgba(8,8,10,1)' : alpha(theme.palette.background.default, 0.5)),
                boxShadow: isSel ? `inset 0 0 0 2px ${theme.palette.primary.main}` : 'none',
                zIndex: isSel ? 1 : 0,
                transition: 'all 0.15s ease',
                '&:hover': { 
                  bgcolor: isSel ? alpha(theme.palette.primary.main, 0.18) : (theme.palette.mode === 'dark' ? 'rgba(20,20,26,1)' : alpha(theme.palette.text.primary, 0.02)),
                },
                '&:nth-of-type(7n)': { borderRight: 0 }
              }}
            >
              <Box sx={{
                width: '26px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px',
                bgcolor: isTdy ? 'primary.main' : 'transparent',
                color: isTdy ? 'white' : (isCurrMonth ? 'text.primary' : 'text.disabled'),
                fontSize: '12px', fontWeight: 900, mb: 0.5,
                boxShadow: isTdy ? `0 3px 10px ${alpha(theme.palette.primary.main, 0.35)}` : 'none'
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
