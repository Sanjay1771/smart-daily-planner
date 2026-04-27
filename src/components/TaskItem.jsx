import React from 'react';
import { 
  Paper, 
  Typography, 
  IconButton, 
  Stack, 
  Box, 
  Chip, 
  Button, 
  useTheme, 
  alpha 
} from '@mui/material';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import RadioButtonUncheckedRoundedIcon from '@mui/icons-material/RadioButtonUncheckedRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';

function TaskItem({ task, toggleComplete, deleteTask }) {
  const muiTheme = useTheme();

  const formattedDate = task.date
    ? new Date(task.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : '';
  
  const formattedTime = task.time
    ? new Date('2000-01-01T' + task.time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    : '';

  const priorityColor = task.priority === 'high' ? '#EF4444' : task.priority === 'medium' ? '#F59E0B' : '#22C55E';

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 1.5, md: 2.5 },
        borderRadius: '14px',
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: task.completed ? alpha(muiTheme.palette.success.main, 0.2) : 'divider',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: muiTheme.palette.mode === 'light' ? '0 10px 15px -3px rgba(0, 0, 0, 0.05)' : '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
          borderColor: 'primary.main',
        }
      }}
    >
      <Stack direction="row" spacing={2.5} alignItems="center">
        <IconButton 
          onClick={() => toggleComplete(task.id)}
          sx={{ 
            color: task.completed ? 'success.main' : 'text.disabled',
            p: 0,
            '&:hover': { color: 'primary.main' }
          }}
        >
          {task.completed ? <CheckCircleRoundedIcon sx={{ fontSize: 26 }} /> : <RadioButtonUncheckedRoundedIcon sx={{ fontSize: 26 }} />}
        </IconButton>
        
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography 
            variant="body1" 
            sx={{ 
              fontWeight: 800, 
              color: task.completed ? 'text.secondary' : 'text.primary',
              textDecoration: task.completed ? 'line-through' : 'none',
              mb: 0.5,
              fontSize: '1rem',
              letterSpacing: '-0.01em'
            }}
          >
            {task.title}
          </Typography>
          
          <Stack direction="row" spacing={2.5} alignItems="center" sx={{ flexWrap: 'wrap', gap: 0.5 }}>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <CalendarMonthRoundedIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 800 }}>{formattedDate}</Typography>
            </Stack>
            {formattedTime && (
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <AccessTimeRoundedIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 800 }}>{formattedTime}</Typography>
              </Stack>
            )}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '2px', bgcolor: priorityColor, transform: 'rotate(45deg)' }} />
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                {task.priority}
              </Typography>
            </Box>
          </Stack>
        </Box>

        <IconButton 
          size="small" 
          onClick={() => deleteTask(task.id)}
          sx={{ 
            color: 'text.disabled',
            bgcolor: alpha(muiTheme.palette.text.primary, 0.02),
            borderRadius: '8px',
            p: 1,
            '&:hover': { color: 'error.main', bgcolor: alpha(muiTheme.palette.error.main, 0.05) }
          }}
        >
          <DeleteRoundedIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Stack>
    </Paper>
  );
}

export default TaskItem;
