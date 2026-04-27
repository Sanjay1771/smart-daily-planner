import React from 'react';
import { Box, Typography, Stack, alpha, useTheme } from '@mui/material';
import { startOfWeek, endOfWeek, eachDayOfInterval, format, isToday } from 'date-fns';

function WeekView({ currentDate, tasks, onDateClick, onEventClick }) {
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

  const startDate = startOfWeek(currentDate);
  const endDate = endOfWeek(currentDate);
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: 'background.default', transition: 'all 0.3s ease' }}>
      {/* Scrollable wrapper for mobile */}
      <Box sx={{ flex: 1, overflowX: 'auto', overflowY: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ minWidth: { xs: '800px', md: '100%' }, display: 'flex', flexDirection: 'column', flex: 1 }}>
      {/* Header */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(8, 1fr)', 
        borderBottom: '1px solid rgba(255,255,255,0.06)', 
        bgcolor: 'background.paper',
        transition: 'all 0.3s ease'
      }}>
        <Box sx={{ py: 2, borderRight: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease' }}>
          <Typography sx={{ fontSize: '11px', fontWeight: 900, color: 'text.secondary', letterSpacing: '0.05em' }}>TIME</Typography>
        </Box>
        {days.map(day => {
          const isTdy = isToday(day);
          return (
            <Box 
              key={day.toString()} 
              onClick={() => onDateClick(format(day, 'yyyy-MM-dd'))} 
              sx={{ 
                py: 1.5, borderRight: '1px solid rgba(255,255,255,0.04)', '&:last-child': { borderRight: 0 },
                display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer',
                bgcolor: isTdy ? alpha(theme.palette.primary.main, 0.05) : 'transparent',
                transition: 'all 0.3s ease',
                '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.08) }
              }}
            >
              <Typography sx={{ fontSize: '10px', fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', opacity: 0.8 }}>{format(day, 'EEE')}</Typography>
              <Typography sx={{ 
                fontSize: '16px', fontWeight: 800, mt: 0.5,
                color: isTdy ? 'primary.main' : 'text.primary',
                transition: 'all 0.2s ease'
              }}>
                {format(day, 'd')}
              </Typography>
            </Box>
          );
        })}
      </Box>

      {/* Grid */}
      <Box sx={{ flex: 1, overflowY: 'auto', position: 'relative', transition: 'all 0.3s ease' }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', minHeight: '1200px', transition: 'all 0.3s ease' }}>
          {/* Time Column */}
          <Box sx={{ borderRight: '1px solid rgba(255,255,255,0.04)', bgcolor: 'background.default', transition: 'all 0.3s ease' }}>
            {hours.map(hour => (
              <Box key={hour} sx={{ height: '64px', borderBottom: '1px solid rgba(255,255,255,0.03)', opacity: 0.3, display: 'flex', pt: 1, justifyContent: 'center', transition: 'all 0.3s ease' }}>
                <Typography sx={{ fontSize: '11px', fontWeight: 700, color: 'text.secondary' }}>
                  {format(new Date().setHours(hour, 0), 'h a')}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Days Columns */}
          {days.map(day => {
            const formattedDate = format(day, "yyyy-MM-dd");
            const dayTasks = tasks.filter(t => (t.event_date || t.date) === formattedDate);
            return (
              <Box key={day.toString()} sx={{ position: 'relative', borderRight: '1px solid rgba(255,255,255,0.04)', '&:last-child': { borderRight: 0 }, transition: 'all 0.3s ease' }}>
                {hours.map(hour => (
                  <Box 
                    key={hour} 
                    onClick={() => onDateClick(formattedDate, `${hour.toString().padStart(2, '0')}:00`)} 
                    sx={{ 
                      height: '64px', 
                      borderBottom: '1px solid rgba(255,255,255,0.03)', 
                      opacity: 0.3,
                      cursor: 'pointer', 
                      transition: 'all 0.2s ease',
                      '&:hover': { bgcolor: 'action.hover', opacity: 1 } 
                    }}
                  ></Box>
                ))}
                
                {dayTasks.map(task => {
                  if (!task.start_time && !task.time) return null;
                  const time = task.start_time || task.time;
                  const [h, m] = time.split(':').map(Number);
                  const top = (h * 64) + (m / 60 * 64);
                  const durationMins = task.duration || 60;
                  const height = (durationMins / 60) * 64;
                  const color = getCategoryColor(task.category);

                  return (
                    <Box
                      key={task.id}
                      onClick={(e) => { e.stopPropagation(); onEventClick(task); }}
                      sx={{
                        position: 'absolute', left: '4px', right: '4px', top: `${top}px`, height: `${height}px`,
                        borderRadius: '8px', p: 1, 
                        bgcolor: theme.palette.mode === 'dark' ? alpha(color, 0.2) : alpha(color, 0.1), 
                        borderLeft: `4px solid ${color}`,
                        border: theme.palette.mode === 'light' ? `1px solid ${alpha(color, 0.2)}` : 'none',
                        cursor: 'pointer', overflow: 'hidden', 
                        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                        zIndex: 2,
                        '&:hover': { 
                          bgcolor: alpha(color, 0.25),
                          transform: 'scale(1.02)',
                          boxShadow: `0 4px 12px ${alpha(color, 0.2)}`,
                          zIndex: 3
                        }
                      }}
                    >
                      <Typography noWrap sx={{ fontSize: '11px', fontWeight: 800, color: 'text.primary' }}>{task.title}</Typography>
                      <Typography sx={{ fontSize: '10px', color: 'text.secondary', fontWeight: 600 }}>{time}</Typography>
                    </Box>
                  );
                })}
              </Box>
            );
          })}
        </Box>
      </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default WeekView;
