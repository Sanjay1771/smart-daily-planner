import React from 'react';
import { Box, Stack, Typography, Button, IconButton, Checkbox, alpha, useTheme } from '@mui/material';
import { format } from 'date-fns';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';

function AgendaPanel({ selectedDate, tasks, stats, onAddTask, onEditTask, onDeleteTask, onToggleTask }) {
  const theme = useTheme();

  const getCategoryColor = (category) => {
    const cat = category?.toUpperCase();
    const colors = {
      WORK: theme.palette.mode === 'dark' ? '#4c95f0ff' : '#3b82f6',
      PERSONAL: '#A855D6',
      GYM: theme.palette.mode === 'dark' ? '#4ADE80' : '#22C55E',
      STUDY: theme.palette.mode === 'dark' ? '#FACC15' : '#D97706',
      HEALTH: theme.palette.mode === 'dark' ? '#F87171' : '#DC2626',
      SHOPPING: '#E8476B',
      OTHER: theme.palette.text.secondary,
    };
    return colors[cat] || theme.palette.text.secondary;
  };

  return (
    <Box sx={{ 
      width: { xs: '100%', md: '320px', lg: '340px' }, 
      flexShrink: { md: 0 },
      display: 'flex', 
      flexDirection: 'column', 
      gap: 2, 
      borderLeft: { xs: 'none', md: '1px solid rgba(255,255,255,0.05)' },
      borderTop: { xs: '1px solid rgba(255,255,255,0.05)', md: 'none' },
      pl: { xs: 0, md: 3 }, 
      pt: { xs: 2, md: 1 },
      height: { xs: 'auto', md: '100%' },
      maxHeight: { xs: '50vh', md: 'none' },
      overflowY: { xs: 'auto', md: 'visible' },
      bgcolor: 'background.default',
      transition: 'all 0.3s ease'
    }}>
      
      {/* 1. Date Header */}
      <Box>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.5}>
          <Typography variant="h6" sx={{ fontWeight: 900, color: 'text.primary', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            {format(selectedDate, 'EEEE')}
          </Typography>
          <IconButton size="small" sx={{ 
            color: 'text.secondary', 
            bgcolor: 'background.paper', 
            borderRadius: '10px', 
            border: '1px solid rgba(255,255,255,0.08)',
            '&:hover': { color: 'primary.main' }
          }}>
            <CalendarMonthRoundedIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Stack>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 700, opacity: 0.6, fontSize: '0.8rem' }}>
          {format(selectedDate, 'MMMM d, yyyy')}
        </Typography>
      </Box>

      {/* 2. Tasks List */}
      <Box sx={{ 
        flex: 1, 
        overflowY: 'auto', 
        pr: 0.5, 
        '&::-webkit-scrollbar': { width: '3px' }, 
        '&::-webkit-scrollbar-thumb': { bgcolor: 'divider', borderRadius: '4px' },
      }}>
        <Stack 
          direction="row" 
          justifyContent="space-between" 
          alignItems="center" 
          sx={{ mb: 2 }}
        >
          <Typography 
            variant="caption" 
            sx={{ fontWeight: 900, color: 'text.secondary', letterSpacing: '0.08em', fontSize: '0.65rem' }}
          >
            TASKS
          </Typography>
          <Button 
            startIcon={<AddRoundedIcon sx={{ fontSize: 12 }} />} 
            onClick={onAddTask}
            sx={{ 
              textTransform: 'none', color: '#60a5fa', fontWeight: 800, fontSize: '0.72rem', 
              bgcolor: 'rgba(59,130,246,0.08)', 
              borderRadius: '8px', px: 1.5, ml: 1, height: 28, minWidth: 'auto',
              '&:hover': { bgcolor: 'rgba(59,130,246,0.14)' }
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
                sx={{
                  p: 1.5, borderRadius: '12px', bgcolor: 'background.paper', border: '1px solid rgba(255,255,255,0.06)',
                  transition: 'all 0.2s ease', 
                  boxShadow: theme.palette.mode === 'light' ? '0 1px 4px rgba(0,0,0,0.02)' : 'none',
                  '&:hover': { 
                    borderColor: alpha(theme.palette.primary.main, 0.2),
                    bgcolor: alpha(theme.palette.primary.main, 0.02),
                  }
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  {/* Checkbox - left */}
                  <Checkbox
                    checked={task.completed}
                    onChange={(e) => { e.stopPropagation(); onToggleTask(task); }}
                    sx={{ p: 0, color: 'text.disabled', '&.Mui-checked': { color: 'success.main' } }}
                    size="small"
                  />
                  {/* Title + Time - center-left */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography noWrap sx={{ 
                      fontWeight: 800, fontSize: '0.82rem', color: task.completed ? 'text.disabled' : 'text.primary',
                      textDecoration: task.completed ? 'line-through' : 'none', lineHeight: 1.3
                    }}>
                      {task.title}
                    </Typography>
                    <Stack direction="row" spacing={0.8} alignItems="center" sx={{ mt: 0.4 }}>
                      <AccessTimeRoundedIcon sx={{ fontSize: 10, color: 'text.disabled' }} />
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.65rem' }}>
                        {task.start_time || 'All Day'}
                      </Typography>
                    </Stack>
                  </Box>
                  {/* Category badge */}
                  <Box sx={{ 
                    px: 0.6, py: 0.1, borderRadius: '4px', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    bgcolor: alpha(getCategoryColor(task.category), 0.08),
                    color: getCategoryColor(task.category), 
                    fontSize: '0.45rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.04em', lineHeight: 1
                  }}>
                    {task.category}
                  </Box>
                  {/* Edit icon */}
                  <IconButton 
                    size="small" 
                    onClick={(e) => { e.stopPropagation(); onEditTask(task); }} 
                    sx={{ 
                      color: 'text.disabled', p: 0.4, 
                      transition: 'all 0.2s ease',
                      '&:hover': { color: 'primary.main', bgcolor: alpha(theme.palette.primary.main, 0.08) } 
                    }}
                  >
                    <EditRoundedIcon sx={{ fontSize: 15 }} />
                  </IconButton>
                  {/* Delete icon */}
                  <IconButton 
                    size="small" 
                    onClick={(e) => { e.stopPropagation(); onDeleteTask(task.id); }} 
                    sx={{ 
                      color: 'text.disabled', p: 0.4, 
                      transition: 'all 0.2s ease',
                      '&:hover': { color: 'error.main', bgcolor: alpha(theme.palette.error.main, 0.08) } 
                    }}
                  >
                    <DeleteOutlineRoundedIcon sx={{ fontSize: 15 }} />
                  </IconButton>
                </Stack>
              </Box>
            ))
          ) : (
            <Box sx={{ textAlign: 'center', py: 5, opacity: 0.25 }}>
               <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.8rem' }}>No tasks scheduled</Typography>
            </Box>
          )}
        </Stack>
      </Box>

      {/* 3. Stats Card — 3 Equal Columns */}
      {stats && (
        <Box sx={{ 
          p: 2, borderRadius: '14px', 
          bgcolor: alpha(theme.palette.text.primary, 0.02), 
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <Stack direction="row" sx={{ '& > *': { flex: 1, textAlign: 'center' } }}>
            <Box>
              <Typography sx={{ fontWeight: 900, fontSize: '1.2rem', lineHeight: 1.2 }}>{stats.total}</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 800, fontSize: '0.55rem', letterSpacing: '0.05em', mt: 0.5, display: 'block' }}>TOTAL</Typography>
            </Box>
            <Box sx={{ borderLeft: `1px solid ${theme.palette.divider}`, borderRight: `1px solid ${theme.palette.divider}` }}>
              <Typography sx={{ fontWeight: 900, fontSize: '1.2rem', lineHeight: 1.2, color: 'success.main' }}>{stats.completed}</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 800, fontSize: '0.55rem', letterSpacing: '0.05em', mt: 0.5, display: 'block' }}>DONE</Typography>
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 900, fontSize: '1.2rem', lineHeight: 1.2, color: 'warning.main' }}>{stats.pending}</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 800, fontSize: '0.55rem', letterSpacing: '0.05em', mt: 0.5, display: 'block' }}>PENDING</Typography>
            </Box>
          </Stack>
        </Box>
      )}

      {/* 4. Quote Card — Premium Glow */}
      <Box sx={{ 
        p: 2.5, borderRadius: '14px', textAlign: 'center',
        background: theme.palette.mode === 'dark' 
          ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.12)} 0%, ${alpha(theme.palette.primary.main, 0.04)} 100%)`
          : `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.07)} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
        border: '1px solid',
        borderColor: alpha(theme.palette.primary.main, 0.12),
        boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.05)}`,
        mb: { xs: 0, md: 1 }
      }}>
        <Typography sx={{ fontWeight: 800, fontSize: '0.78rem', mb: 0.5, fontStyle: 'italic', lineHeight: 1.5 }}>
          "Every planned day builds a stronger future."
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.65rem' }}>
          Stay consistent.
        </Typography>
      </Box>
    </Box>
  );
}

export default AgendaPanel;
