import React from 'react';
import { Box, Stack, Typography, Button, IconButton, alpha, useTheme } from '@mui/material';
import { format, addMonths, subMonths, addWeeks, subWeeks, addDays, subDays, startOfToday } from 'date-fns';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';

function CalendarHeader({ currentDate, setCurrentDate, view, setView }) {
  const theme = useTheme();

  const handlePrev = () => {
    if (view === 'month') setCurrentDate(subMonths(currentDate, 1));
    else if (view === 'week') setCurrentDate(subWeeks(currentDate, 1));
    else setCurrentDate(subDays(currentDate, 1));
  };

  const handleNext = () => {
    if (view === 'month') setCurrentDate(addMonths(currentDate, 1));
    else if (view === 'week') setCurrentDate(addWeeks(currentDate, 1));
    else setCurrentDate(addDays(currentDate, 1));
  };

  const handleToday = () => {
    setCurrentDate(startOfToday());
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center', 
        mb: 4, 
        px: 1,
        width: '100%',
        transition: 'all 0.3s ease'
      }}
    >
      {/* LEFT ZONE: Arrows + Today + Month Title */}
      <Stack direction="row" alignItems="center" spacing={4} sx={{ transition: 'all 0.3s ease' }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Stack 
            direction="row" 
            spacing={0.5} 
            sx={{ 
              bgcolor: 'background.paper', 
              p: 0.6, 
              borderRadius: '14px', 
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: theme.palette.mode === 'dark' ? '0 4px 20px rgba(0,0,0,0.4)' : '0 4px 20px rgba(0,0,0,0.04)',
              transition: 'all 0.3s ease'
            }}
          >
            <IconButton size="small" onClick={handlePrev} sx={{ color: 'text.primary', transition: 'all 0.2s ease', '&:hover': { bgcolor: 'action.hover', transform: 'translateX(-2px)' } }}>
              <ChevronLeftRoundedIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={handleNext} sx={{ color: 'text.primary', transition: 'all 0.2s ease', '&:hover': { bgcolor: 'action.hover', transform: 'translateX(2px)' } }}>
              <ChevronRightRoundedIcon fontSize="small" />
            </IconButton>
          </Stack>
          
          <Button 
            onClick={handleToday}
            sx={{ 
              bgcolor: 'background.paper', 
              color: 'text.primary', 
              textTransform: 'none', 
              px: 2.5, 
              height: 40, 
              borderRadius: '12px', 
              border: '1px solid',
              borderColor: 'divider',
              fontWeight: 800,
              fontSize: '0.85rem',
              '&:hover': { bgcolor: 'action.hover', transform: 'translateY(-1px)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' },
              transition: 'all 0.2s ease'
            }}
          >
            Today
          </Button>
        </Stack>

        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 900, 
            color: 'text.primary', 
            letterSpacing: '-0.04em',
            whiteSpace: 'nowrap',
            fontSize: { xs: '1.25rem', md: '1.75rem' },
            transition: 'all 0.3s ease'
          }}
        >
          {format(currentDate, 'MMMM')} <span style={{ color: theme.palette.text.secondary, fontWeight: 700, marginLeft: '8px', opacity: 0.6 }}>{format(currentDate, 'yyyy')}</span>
        </Typography>
      </Stack>

      {/* RIGHT ZONE: Month Week Day segmented buttons */}
      <Stack 
        direction="row" 
        spacing={0.5} 
        sx={{ 
          bgcolor: 'background.paper', 
          p: 0.6, 
          borderRadius: '14px', 
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: theme.palette.mode === 'dark' ? '0 4px 20px rgba(0,0,0,0.4)' : '0 4px 20px rgba(0,0,0,0.04)',
          transition: 'all 0.3s ease'
        }}
      >
        {['month', 'week', 'day'].map((v) => (
          <Button
            key={v}
            onClick={() => setView(v)}
            sx={{
              textTransform: 'none',
              px: 2.5,
              py: 0.8,
              borderRadius: '10px',
              color: view === v ? 'text.primary' : 'text.secondary',
              bgcolor: view === v ? (theme.palette.mode === 'dark' ? alpha(theme.palette.primary.main, 0.2) : alpha(theme.palette.primary.main, 0.08)) : 'transparent',
              fontWeight: 800,
              fontSize: '0.8rem',
              minWidth: '80px',
              '&:hover': { bgcolor: view === v ? alpha(theme.palette.primary.main, 0.15) : 'action.hover' },
              transition: 'all 0.2s ease'
            }}
          >
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </Button>
        ))}
      </Stack>
    </Box>
  );
}

export default CalendarHeader;
