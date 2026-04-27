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
        flexWrap: 'wrap',
        gap: 1.5,
        mb: { xs: 2, md: 3 }, 
        pt: { xs: 0.5, md: 1 },
        px: 0.5,
        width: '100%',
        transition: 'all 0.3s ease'
      }}
    >
      {/* LEFT ZONE: Arrows + Today + Month Title */}
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ transition: 'all 0.3s ease', flexWrap: 'wrap', gap: 1 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Stack 
            direction="row" 
            spacing={0.5} 
            sx={{ 
              bgcolor: 'background.paper', 
              p: 0.5, 
              borderRadius: '12px', 
              border: '1px solid rgba(255,255,255,0.08)',
              transition: 'all 0.3s ease'
            }}
          >
            <IconButton size="small" onClick={handlePrev} sx={{ color: 'text.primary', '&:hover': { bgcolor: 'action.hover' } }}>
              <ChevronLeftRoundedIcon sx={{ fontSize: 20 }} />
            </IconButton>
            <IconButton size="small" onClick={handleNext} sx={{ color: 'text.primary', '&:hover': { bgcolor: 'action.hover' } }}>
              <ChevronRightRoundedIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Stack>
          
          <Button 
            onClick={handleToday}
            sx={{ 
              bgcolor: 'background.paper', 
              color: 'text.primary', 
              textTransform: 'none', 
              px: { xs: 1.5, md: 2 }, 
              height: 36, 
              borderRadius: '10px', 
              border: '1px solid rgba(255,255,255,0.08)',
              fontWeight: 800,
              fontSize: '0.8rem',
              '&:hover': { bgcolor: 'action.hover' },
              transition: 'all 0.2s ease'
            }}
          >
            Today
          </Button>
        </Stack>

        <Typography 
          sx={{ 
            fontWeight: 900, 
            color: 'text.primary', 
            letterSpacing: '-0.03em',
            whiteSpace: 'nowrap',
            fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
            transition: 'all 0.3s ease'
          }}
        >
          {format(currentDate, 'MMMM')} <span style={{ color: theme.palette.text.secondary, fontWeight: 700, marginLeft: '6px', opacity: 0.5 }}>{format(currentDate, 'yyyy')}</span>
        </Typography>
      </Stack>

      {/* RIGHT ZONE: Month Week Day segmented buttons */}
      <Stack 
        direction="row" 
        spacing={0.5} 
        sx={{ 
          bgcolor: 'background.paper', 
          p: 0.5, 
          borderRadius: '12px', 
          border: '1px solid rgba(255,255,255,0.08)',
          transition: 'all 0.3s ease'
        }}
      >
        {['month', 'week', 'day'].map((v) => (
          <Button
            key={v}
            onClick={() => setView(v)}
            sx={{
              textTransform: 'none',
              px: { xs: 1.5, sm: 2, md: 2 },
              py: 0.6,
              borderRadius: '8px',
              color: view === v ? 'primary.main' : 'text.secondary',
              bgcolor: view === v ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
              fontWeight: 800,
              fontSize: { xs: '0.7rem', sm: '0.8rem' },
              minWidth: { xs: '52px', md: '68px' },
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
