import React from 'react';
import { Box, Stack, Typography, Button, IconButton, Checkbox, alpha, useTheme } from '@mui/material';
import { format } from 'date-fns';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';

function AgendaPanel({ selectedDate, tasks, stats, onAddTask, onEditTask, onDeleteTask, onToggleTask }) {
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

  return (
    <Box sx={{ 
      width: { xs: '100%', md: '360px' }, 
      display: 'flex', 
      flexDirection: 'column', 
      gap: 3, 
      borderLeft: { xs: 'none', md: '1px solid' },
      borderColor: 'divider', 
      pl: { xs: 0, md: 3 }, 
      height: '100%',
      bgcolor: 'background.default',
      transition: 'all 0.3s ease'
    }}>
      
      {/* 1. Date Header */}
      <Box sx={{ pt: 1, transition: 'all 0.3s ease' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h5" sx={{ fontWeight: 900, color: 'text.primary', letterSpacing: '-0.02em', transition: 'all 0.3s ease' }}>
            {format(selectedDate, 'EEEE')}
          </Typography>
          <IconButton size="small" sx={{ 
            color: 'text.secondary', 
            bgcolor: 'background.paper', 
            borderRadius: '12px', 
            border: '1px solid', 
            borderColor: 'divider',
            transition: 'all 0.2s ease',
            '&:hover': { transform: 'rotate(15deg)', color: 'primary.main' }
          }}>
            <CalendarMonthRoundedIcon fontSize="small" />
          </IconButton>
        </Stack>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 700, opacity: 0.7 }}>
          {format(selectedDate, 'MMMM d, yyyy')}
        </Typography>
      </Box>

      {/* 2. Tasks List */}
      <Box sx={{ 
        flex: 1, 
        overflowY: 'auto', 
        pr: 1, 
        '&::-webkit-scrollbar': { width: '4px' }, 
        '&::-webkit-scrollbar-thumb': { bgcolor: 'divider', borderRadius: '4px' },
        transition: 'all 0.3s ease'
      }}>
        <Stack 
          direction="row" 
          justifyContent="space-between" 
          alignItems="center" 
          sx={{ 
            width: '100%', 
            px: 1, 
            mb: 2,
          }}
        >
          <Typography 
            variant="overline" 
            sx={{ 
              fontWeight: 900, 
              color: 'text.secondary', 
              letterSpacing: '0.12em', 
              fontSize: '0.7rem',
              opacity: 0.8
            }}
          >
            TASKS
          </Typography>
          <Button 
            startIcon={<AddRoundedIcon sx={{ fontSize: 16 }} />} 
            onClick={onAddTask}
            sx={{ 
              textTransform: 'none', 
              color: 'primary.main', 
              fontWeight: 800, 
              fontSize: '0.75rem', 
              bgcolor: theme.palette.mode === 'dark' ? alpha(theme.palette.primary.main, 0.15) : alpha(theme.palette.primary.main, 0.08), 
              borderRadius: '100px', 
              px: 1.5,
              height: 28,
              minWidth: 'auto',
              transition: 'all 0.2s ease',
              '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.15), transform: 'scale(1.05)' }
            }}
          >
            Add
          </Button>
        </Stack>

        <Stack spacing={1.5}>
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <Box
                key={task.id}
                onClick={() => onEditTask(task)}
                sx={{
                  p: 2, borderRadius: '18px', bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider',
                  cursor: 'pointer', transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)', 
                  boxShadow: theme.palette.mode === 'light' ? '0 2px 8px rgba(0,0,0,0.02)' : 'none',
                  '&:hover': { 
                    bgcolor: alpha(theme.palette.primary.main, 0.02), 
                    borderColor: alpha(theme.palette.primary.main, 0.3),
                    transform: 'translateX(4px)',
                    boxShadow: theme.palette.mode === 'light' ? '0 4px 15px rgba(0,0,0,0.05)' : '0 4px 20px rgba(0,0,0,0.3)'
                  }
                }}
              >
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Checkbox
                    checked={task.completed}
                    onChange={(e) => { e.stopPropagation(); onToggleTask(task); }}
                    sx={{ p: 0, color: 'text.secondary', '&.Mui-checked': { color: 'success.main' } }}
                  />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography noWrap sx={{ 
                      fontWeight: 800, fontSize: '0.9rem', color: task.completed ? 'text.secondary' : 'text.primary',
                      textDecoration: task.completed ? 'line-through' : 'none',
                      transition: 'all 0.2s ease'
                    }}>
                      {task.title}
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center" mt={0.5}>
                      <AccessTimeRoundedIcon sx={{ fontSize: 12, color: 'text.secondary', opacity: 0.6 }} />
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, opacity: 0.8 }}>
                        {task.start_time || 'All Day'}
                      </Typography>
                      <Box sx={{ 
                        px: 0.8, py: 0.1, borderRadius: '6px', 
                        bgcolor: alpha(getCategoryColor(task.category), 0.1),
                        color: getCategoryColor(task.category), 
                        fontSize: '9px', fontWeight: 900, textTransform: 'uppercase',
                        letterSpacing: '0.02em'
                      }}>
                        {task.category}
                      </Box>
                    </Stack>
                  </Box>
                  <IconButton 
                    size="small" 
                    onClick={(e) => { e.stopPropagation(); onDeleteTask(task.id); }} 
                    sx={{ color: 'text.secondary', opacity: 0.3, transition: 'all 0.2s ease', '&:hover': { color: 'error.main', opacity: 1, transform: 'scale(1.1)' } }}
                  >
                    <DeleteOutlineRoundedIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </Box>
            ))
          ) : (
            <Box sx={{ textAlign: 'center', py: 8, opacity: 0.2 }}>
               <Typography variant="body2" sx={{ fontWeight: 800, color: 'text.primary' }}>No tasks scheduled</Typography>
            </Box>
          )}
        </Stack>
      </Box>

      {/* 3. Small Stats Card */}
      {stats && (
        <Box sx={{ 
          p: 2, 
          borderRadius: '20px', 
          bgcolor: theme.palette.mode === 'dark' ? alpha(theme.palette.background.paper, 0.4) : alpha(theme.palette.primary.main, 0.05), 
          border: '1px solid', 
          borderColor: theme.palette.mode === 'dark' ? 'divider' : alpha(theme.palette.primary.main, 0.1),
          transition: 'all 0.3s ease'
        }}>
          <Stack direction="row" justifyContent="space-around">
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" sx={{ fontWeight: 900, color: 'text.primary' }}>{stats.total}</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 900, fontSize: '0.65rem', letterSpacing: '0.05em', opacity: 0.8 }}>TOTAL</Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" sx={{ fontWeight: 900, color: 'success.main' }}>{stats.completed}</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 900, fontSize: '0.65rem', letterSpacing: '0.05em', opacity: 0.8 }}>DONE</Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" sx={{ fontWeight: 900, color: 'warning.main' }}>{stats.pending}</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 900, fontSize: '0.65rem', letterSpacing: '0.05em', opacity: 0.8 }}>PENDING</Typography>
            </Box>
          </Stack>
        </Box>
      )}

      {/* 4. Compact Quote Card (Reduced Height) */}
      <Box sx={{ 
        p: 2, borderRadius: '24px', 
        background: theme.palette.mode === 'dark' 
          ? 'linear-gradient(135deg, #2D1B69 0%, #1A1F26 100%)'
          : `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.12)} 0%, ${alpha(theme.palette.primary.main, 0.04)} 100%)`,
        textAlign: 'center', position: 'relative', overflow: 'hidden', 
        border: '1px solid',
        borderColor: theme.palette.mode === 'dark' ? alpha(theme.palette.primary.main, 0.3) : alpha(theme.palette.primary.main, 0.1),
        transition: 'all 0.3s ease'
      }}>
        <Typography variant="body2" sx={{ fontWeight: 800, color: 'text.primary', mb: 0.5, fontSize: '0.8rem', fontStyle: 'italic', opacity: 0.9 }}>
          "Every planned day builds a stronger future."
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.02em', opacity: 0.7 }}>
          Stay consistent.
        </Typography>
      </Box>
    </Box>
  );
}

export default AgendaPanel;
