import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Stack, 
  Button, 
  IconButton, 
  TextField, 
  Switch, 
  Divider, 
  Avatar, 
  Grid,
  useTheme as useMuiTheme,
  alpha,
  ToggleButtonGroup,
  ToggleButton,
  Chip
} from '@mui/material';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import PaletteRoundedIcon from '@mui/icons-material/PaletteRounded';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import ComputerRoundedIcon from '@mui/icons-material/ComputerRounded';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import StorageRoundedIcon from '@mui/icons-material/StorageRounded';
import LanguageRoundedIcon from '@mui/icons-material/LanguageRounded';
import { useTheme } from '../contexts/ThemeContext';

function SettingsTabs({ user }) {
  const [activeTab, setActiveTab] = useState('profile');
  const { theme: currentTheme, setTheme } = useTheme();
  const muiTheme = useMuiTheme();

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('planner_settings');
    return saved ? JSON.parse(saved) : {
      fullName: user?.name || '',
      email: user?.email || '',
      reminders: true,
      emailAlerts: false,
      timeFormat: '12h',
      weekStart: 'sunday',
    };
  });
  
  const [saved, setSaved] = useState(false);

  const saveSettings = () => {
    localStorage.setItem('planner_settings', JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tabs = [
    { id: 'profile', label: 'Account Config', icon: <PersonRoundedIcon sx={{ fontSize: 18 }} /> },
    { id: 'notifications', label: 'Alert Signals', icon: <NotificationsRoundedIcon sx={{ fontSize: 18 }} /> },
    { id: 'security', label: 'Infrastructure', icon: <ShieldRoundedIcon sx={{ fontSize: 18 }} /> },
    { id: 'preferences', label: 'Defaults', icon: <TuneRoundedIcon sx={{ fontSize: 18 }} /> },
    { id: 'data', label: 'Data Hub', icon: <StorageRoundedIcon sx={{ fontSize: 18 }} /> },
  ];

  const SettingRow = ({ label, desc, children }) => (
    <Box sx={{ 
      display: 'flex', 
      alignItems: { xs: 'flex-start', sm: 'center' }, 
      justifyContent: 'space-between', 
      flexWrap: 'wrap',
      gap: 1.5,
      py: { xs: 2.5, md: 3.5 }, 
      borderBottom: '1px solid', 
      borderColor: alpha(muiTheme.palette.divider, 0.5),
      '&:last-child': { borderBottom: 'none' }
    }}>
      <Box sx={{ flex: 1, pr: { xs: 0, sm: 4 }, minWidth: 0 }}>
        <Typography variant="body2" sx={{ fontWeight: 800, color: 'text.primary' }}>{label}</Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'block', mt: 0.5 }}>{desc}</Typography>
      </Box>
      <Box>{children}</Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 6 }}>
      {/* Tab Navigation — Startup Sidebar Style */}
      <Box sx={{ width: { xs: '100%', md: 240 }, flexShrink: 0 }}>
        <Paper elevation={0} sx={{ p: 1.5, borderRadius: '20px', border: '1px solid', borderColor: 'divider', bgcolor: alpha(muiTheme.palette.text.primary, 0.01) }}>
          <Stack spacing={0.5}>
            {tabs.map(tab => (
              <Button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                variant="text"
                disableElevation
                startIcon={tab.icon}
                sx={{
                  justifyContent: 'flex-start',
                  px: 2.5,
                  py: 1.5,
                  borderRadius: '12px',
                  color: activeTab === tab.id ? 'primary.main' : 'text.secondary',
                  bgcolor: activeTab === tab.id ? alpha(muiTheme.palette.primary.main, 0.1) : 'transparent',
                  fontWeight: activeTab === tab.id ? 900 : 700,
                  fontSize: '0.85rem',
                  '&:hover': {
                    bgcolor: activeTab === tab.id ? alpha(muiTheme.palette.primary.main, 0.15) : alpha(muiTheme.palette.text.primary, 0.04),
                  }
                }}
              >
                {tab.label}
              </Button>
            ))}
          </Stack>
        </Paper>
      </Box>

      {/* Content Area */}
      <Box sx={{ flex: 1 }}>
        <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: { xs: '16px', md: '24px' }, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
          {activeTab === 'profile' && (
            <Stack spacing={5}>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 900, mb: 1, letterSpacing: '-0.03em' }}>Workspace Profile</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>Configure your global workspace identity.</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: { xs: 'flex-start', sm: 'center' }, flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 2, md: 4 }, p: { xs: 2.5, md: 4 }, bgcolor: alpha(muiTheme.palette.text.primary, 0.02), borderRadius: '20px', border: '1px solid', borderColor: 'divider' }}>
                <Avatar sx={{ width: 72, height: 72, bgcolor: 'primary.main', fontWeight: 900, borderRadius: '16px' }}>{user?.name?.[0]}</Avatar>
                <Box>
                   <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>Identity Visual</Typography>
                   <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2, fontWeight: 600 }}>This avatar is visible across your workspace.</Typography>
                   <Button size="small" variant="contained" disableElevation sx={{ borderRadius: '8px', px: 3 }}>Replace Icon</Button>
                </Box>
              </Box>

              <Stack spacing={3}>
                <TextField fullWidth label="Identity Name" value={settings.fullName} onChange={e => setSettings({...settings, fullName: e.target.value})} />
                <TextField fullWidth label="System Email" value={settings.email} onChange={e => setSettings({...settings, email: e.target.value})} />
              </Stack>
              
              <Box>
                <Button 
                  variant="contained" 
                  disableElevation
                  onClick={saveSettings} 
                  startIcon={saved ? <CheckCircleRoundedIcon /> : <BoltRoundedIcon />}
                  sx={{ px: 5, py: 1.5, borderRadius: '12px' }}
                >
                  {saved ? 'Synchronized' : 'Push Changes'}
                </Button>
              </Box>
            </Stack>
          )}

          {activeTab === 'data' && (
            <Stack spacing={5}>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 900, mb: 1, letterSpacing: '-0.03em' }}>Data Infrastructure</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>Manage your workspace data and persistence.</Typography>
              </Box>

              <Stack spacing={1}>
                <SettingRow label="Export Workspace" desc="Download all your tasks and logs in a portable JSON format.">
                  <Button variant="outlined" size="small" sx={{ borderRadius: '8px' }}>Export Data</Button>
                </SettingRow>
                <SettingRow label="Local Persistence" desc="Clear local cache to re-sync with the primary cloud engine.">
                  <Button variant="outlined" color="error" size="small" sx={{ borderRadius: '8px' }}>Purge Cache</Button>
                </SettingRow>
              </Stack>
            </Stack>
          )}

          {activeTab === 'notifications' && (
            <Stack spacing={1}>
              <Box sx={{ mb: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 900, mb: 1, letterSpacing: '-0.03em' }}>Alert Signals</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>Manage how the system pushes information.</Typography>
              </Box>
              <SettingRow label="Real-time Reminders" desc="High-priority signals pushed before task deadlines.">
                <Switch checked={settings.reminders} onChange={() => setSettings({...settings, reminders: !settings.reminders})} />
              </SettingRow>
              <SettingRow label="Workspace Digest" desc="A comprehensive daily summary of workspace health.">
                <Switch checked={settings.emailAlerts} onChange={() => setSettings({...settings, emailAlerts: !settings.emailAlerts})} />
              </SettingRow>
            </Stack>
          )}

          {activeTab === 'security' && (
            <Stack spacing={4}>
               <Box>
                <Typography variant="h5" sx={{ fontWeight: 900, mb: 1, letterSpacing: '-0.03em' }}>Security Infrastructure</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>Protect your workspace with high-entropy keys.</Typography>
              </Box>
              <Stack spacing={3}>
                <TextField fullWidth type="password" label="Current Secret Key" />
                <TextField fullWidth type="password" label="New Secret Key" />
              </Stack>
              <Box>
                 <Button variant="contained" disableElevation sx={{ px: 5, py: 1.5, borderRadius: '12px' }}>Update Keys</Button>
              </Box>
            </Stack>
          )}

          {activeTab === 'preferences' && (
            <Stack spacing={1}>
              <Box sx={{ mb: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 900, mb: 1, letterSpacing: '-0.03em' }}>System Defaults</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>Fine-tune core workspace behaviors.</Typography>
              </Box>
              <SettingRow label="Time Engine Format" desc="Standardize time display across all workspace modules.">
                <ToggleButtonGroup
                  value={settings.timeFormat}
                  exclusive
                  onChange={(e, val) => val && setSettings({...settings, timeFormat: val})}
                  size="small"
                  sx={{ borderRadius: '10px', p: 0.5, bgcolor: alpha(muiTheme.palette.text.primary, 0.05) }}
                >
                  <ToggleButton value="12h" sx={{ px: 3, borderRadius: '8px !important', border: 'none !important', fontWeight: 900 }}>12H</ToggleButton>
                  <ToggleButton value="24h" sx={{ px: 3, borderRadius: '8px !important', border: 'none !important', fontWeight: 900 }}>24H</ToggleButton>
                </ToggleButtonGroup>
              </SettingRow>
            </Stack>
          )}
        </Paper>
      </Box>
    </Box>
  );
}

export default SettingsTabs;
