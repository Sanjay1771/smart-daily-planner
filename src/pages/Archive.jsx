import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Container,
  Stack,
  Paper,
  Grid,
  TextField,
  InputAdornment,
  Chip,
  alpha,
  useTheme,
  Button,
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded';
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded';
import TaskList from '../components/TaskList';
import { supabase } from '../supabaseClient';

function Archive({ user }) {
  const muiTheme = useTheme();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchArchivedTasks = useCallback(async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('user_id', user.id)
        .eq('completed', true)
        .order('event_date', { ascending: false });
      
      if (error) throw error;
      setTasks(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchArchivedTasks();
  }, [fetchArchivedTasks]);

  const filteredTasks = tasks.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 6 } }}>
      <Stack spacing={5}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: '-0.04em', fontSize: { xs: '1.5rem', md: '2.125rem' } }}>Task Archive</Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 600 }}>Your legacy of productivity.</Typography>
          </Box>
          <Chip 
            icon={<VerifiedRoundedIcon sx={{ fontSize: '18px !important' }} />} 
            label={`${tasks.length} Achievements`} 
            color="success" 
            sx={{ fontWeight: 800, borderRadius: '10px' }} 
          />
        </Box>

        {/* Search Bar */}
        <TextField
          fullWidth
          placeholder="Search through your achievements..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '16px',
              bgcolor: 'background.paper',
            }
          }}
        />

        {/* Archive Summary Stats */}
        <Grid container spacing={3}>
           <Grid item xs={12} sm={4}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: '20px', border: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
                 <Typography variant="caption" sx={{ fontWeight: 900, color: 'text.disabled', textTransform: 'uppercase' }}>Efficiency Rating</Typography>
                 <Typography variant="h4" sx={{ fontWeight: 900, color: 'success.main' }}>100%</Typography>
              </Paper>
           </Grid>
           <Grid item xs={12} sm={8}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: '20px', border: '1px solid', borderColor: 'divider', bgcolor: alpha(muiTheme.palette.success.main, 0.02) }}>
                 <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1 }}>Legacy Stats</Typography>
                 <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>You've successfully delivered {tasks.length} high-impact outcomes since joining PlanPro.</Typography>
              </Paper>
           </Grid>
        </Grid>

        {/* Archived Tasks List */}
        <Box>
          <Stack direction="row" alignItems="center" spacing={1.5} mb={3}>
            <HistoryRoundedIcon color="disabled" />
            <Typography variant="h6" sx={{ fontWeight: 800 }}>Completed History</Typography>
          </Stack>
          
          <TaskList 
            tasks={filteredTasks} 
            view="Archive" 
            onRefresh={fetchArchivedTasks}
          />
        </Box>
      </Stack>
    </Container>
  );
}

export default Archive;
