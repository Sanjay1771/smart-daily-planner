import React from 'react';
import { Box, Typography, Stack, alpha, useTheme } from '@mui/material';
import { format, isToday } from 'date-fns';

function DayView({ currentDate, tasks, onDateClick, onEventClick }) {
  const theme = useTheme();
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const formattedDate = format(currentDate, "yyyy-MM-dd");
  const dayTasks = tasks.filter(t => (t.event_date || t.date) === formattedDate);

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', bgcolor: 'background.default', overflowY: 'auto', transition: 'all 0.3s ease' }}>
      <Box sx={{ p: 3, borderBottom: '1px solid rgba(255,255,255,0.06)', bgcolor: 'background.paper', transition: 'all 0.3s ease' }}>
        <Typography variant="h5" sx={{ fontWeight: 900, color: 'text.primary', letterSpacing: '-0.02em', transition: 'all 0.3s ease' }}>
          {format(currentDate, 'EEEE, MMMM d')}
        </Typography>
      </Box>

      <Box sx={{ flex: 1, p: { xs: 1, md: 3 }, transition: 'all 0.3s ease' }}>
        {hours.map((hour) => {
          const hourTasks = dayTasks.filter(t => t.start_time?.startsWith(hour.toString().padStart(2, '0')));
          return (
            <Stack key={hour} direction="row" spacing={3} sx={{ minHeight: '80px', borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'all 0.3s ease' }}>
              <Typography sx={{ width: '60px', pt: 1, fontSize: '12px', fontWeight: 800, color: 'text.secondary', opacity: 0.6, transition: 'all 0.3s ease' }}>
                {format(new Date().setHours(hour, 0), 'h a')}
              </Typography>
              <Box sx={{ flex: 1, display: 'flex', gap: 1.5, py: 1.5 }}>
                {hourTasks.map((task) => (
                  <Box
                    key={task.id}
                    onClick={() => onEventClick(task)}
                    sx={{
                      px: 2.5, py: 1.5, borderRadius: '14px', 
                      bgcolor: 'background.paper', 
                      border: '1px solid rgba(255,255,255,0.06)',
                      boxShadow: theme.palette.mode === 'light' ? '0 2px 10px rgba(0,0,0,0.03)' : '0 4px 20px rgba(0,0,0,0.2)',
                      cursor: 'pointer', transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)', 
                      '&:hover': { 
                        bgcolor: 'action.hover', 
                        transform: 'translateY(-2px) scale(1.02)',
                        boxShadow: theme.palette.mode === 'light' ? '0 8px 25px rgba(0,0,0,0.06)' : '0 10px 40px rgba(0,0,0,0.4)',
                        borderColor: 'primary.main'
                      }
                    }}
                  >
                    <Typography sx={{ fontSize: '14px', fontWeight: 800, color: 'text.primary' }}>{task.title}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>{task.start_time}</Typography>
                  </Box>
                ))}
              </Box>
            </Stack>
          );
        })}
      </Box>
    </Box>
  );
}

export default DayView;
