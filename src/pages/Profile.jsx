import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Paper, 
  Avatar, 
  Button, 
  Grid, 
  Divider, 
  Stack, 
  Chip, 
  IconButton,
  Container,
  alpha,
  useTheme
} from '@mui/material';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';

function Profile({ user }) {
  const navigate = useNavigate();
  const muiTheme = useTheme();

  const initials = user
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '';

  // Get task stats from current list (mocked for this component logic)
  const storageKey = `planner_tasks_${user?.id}`;
  const tasks = JSON.parse(localStorage.getItem(storageKey) || '[]');
  const completedCount = tasks.filter(t => t.completed).length;
  const completionRate = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
      <Stack spacing={6}>
        {/* Startup Profile Header */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: 5 }}>
          <Box sx={{ position: 'relative' }}>
            <Avatar 
              sx={{ 
                width: 120, 
                height: 120, 
                fontSize: '2.5rem', 
                fontWeight: 900,
                bgcolor: 'primary.main',
                color: 'white',
                borderRadius: '24px',
                boxShadow: `0 20px 40px ${alpha(muiTheme.palette.primary.main, 0.25)}`,
                transform: 'rotate(-3deg)'
              }}
            >
              {initials}
            </Avatar>
            <IconButton 
              sx={{ 
                position: 'absolute', 
                bottom: -5, 
                right: -5, 
                bgcolor: 'text.primary', 
                color: 'background.paper',
                boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
                '&:hover': { bgcolor: 'primary.main' }
              }}
              size="small"
              onClick={() => navigate('/settings')}
            >
              <EditRoundedIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>
          <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
            <Stack direction="row" alignItems="center" spacing={2} justifyContent={{ xs: 'center', md: 'flex-start' }} mb={1}>
              <Typography variant="h4" sx={{ fontWeight: 900, color: 'text.primary', letterSpacing: '-0.04em' }}>
                {user?.name}
              </Typography>
              <Chip label="PREMIUM" size="small" sx={{ height: 20, fontWeight: 900, bgcolor: 'primary.main', color: 'white', fontSize: '0.65rem' }} />
            </Stack>
            <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 700, mb: 3 }}>
              Lead Productivity Architect · {user?.email}
            </Typography>
            <Stack direction="row" spacing={2} justifyContent={{ xs: 'center', md: 'flex-start' }}>
               <Button variant="contained" disableElevation onClick={() => navigate('/settings')} sx={{ borderRadius: '10px' }}>
                 Workspace Settings
               </Button>
               <Button variant="outlined" sx={{ borderRadius: '10px', fontWeight: 700 }}>
                 View Analytics
               </Button>
            </Stack>
          </Box>
        </Box>

        {/* Professional Stats Section */}
        <Grid container spacing={3}>
          {[
            { label: 'Cumulative Tasks', value: tasks.length, icon: <AssignmentRoundedIcon />, color: '#4F46E5' },
            { label: 'Milestones Reached', value: completedCount, icon: <CheckCircleRoundedIcon />, color: '#22C55E' },
            { label: 'Efficiency Rating', value: `${completionRate}%`, icon: <TrendingUpRoundedIcon />, color: '#0EA5E9' },
          ].map(stat => (
            <Grid item xs={12} sm={4} key={stat.label}>
              <Paper variant="outlined" sx={{ p: 4, borderRadius: '20px', transition: 'all 0.2s', '&:hover': { borderColor: 'primary.main', bgcolor: alpha(muiTheme.palette.primary.main, 0.01) } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box sx={{ color: stat.color }}>{stat.icon}</Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    {stat.label}
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 900 }}>{stat.value}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Security & Workspace Info */}
        <Box>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 900, letterSpacing: '-0.02em' }}>Security Infrastructure</Typography>
          <Paper variant="outlined" sx={{ borderRadius: '20px', overflow: 'hidden' }}>
            {[
              { label: 'Primary ID', value: user?.name, icon: <EditRoundedIcon sx={{ fontSize: 18 }} /> },
              { label: 'Access Token', value: user?.email, icon: <EmailRoundedIcon sx={{ fontSize: 18 }} /> },
              { label: 'Account Security', value: 'Multi-Factor Enabled', icon: <ShieldRoundedIcon sx={{ fontSize: 18 }} />, badge: 'SECURE' },
            ].map((item, idx) => (
              <React.Fragment key={item.label}>
                <Box sx={{ 
                  p: 3, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  '&:hover': { bgcolor: alpha(muiTheme.palette.text.primary, 0.01) }
                }}>
                  <Stack direction="row" alignItems="center" spacing={3}>
                    <Box sx={{ color: 'text.disabled' }}>{item.icon}</Box>
                    <Box>
                       <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{item.label}</Typography>
                       <Typography variant="body1" sx={{ fontWeight: 800, color: 'text.primary' }}>{item.value}</Typography>
                    </Box>
                  </Stack>
                  {item.badge && (
                    <Chip 
                      label={item.badge} 
                      size="small" 
                      icon={<BoltRoundedIcon sx={{ fontSize: '14px !important' }} />}
                      sx={{ bgcolor: alpha('#22C55E', 0.1), color: '#22C55E', fontWeight: 900, fontSize: '0.7rem' }} 
                    />
                  )}
                </Box>
                {idx < 2 && <Divider sx={{ mx: 3, opacity: 0.5 }} />}
              </React.Fragment>
            ))}
          </Paper>
        </Box>
      </Stack>
    </Container>
  );
}

export default Profile;
