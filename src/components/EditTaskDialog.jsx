import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  MenuItem,
  Grid,
  Typography,
  Box,
  useTheme,
  alpha
} from '@mui/material';
import { DatePicker, TimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import EditRoundedIcon from '@mui/icons-material/EditRounded';

const CATEGORIES = [
  { value: 'work', label: 'Work', emoji: '💼' },
  { value: 'personal', label: 'Personal', emoji: '🏠' },
  { value: 'study', label: 'Study', emoji: '📚' },
  { value: 'health', label: 'Health', emoji: '💪' },
];

const PRIORITIES = [
  { value: 'low', label: 'Low', color: '#34C759' },
  { value: 'medium', label: 'Medium', color: '#FF9F0A' },
  { value: 'high', label: 'High', color: '#FF3B30' },
];

function EditTaskDialog({ open, task, onClose, onSave }) {
  const muiTheme = useTheme();
  
  const [formData, setFormData] = useState({
    title: '',
    date: dayjs(),
    time: dayjs(),
    category: 'work',
    priority: 'medium',
    description: ''
  });

  useEffect(() => {
    if (task) {
      setFormData({
        id: task.id,
        title: task.title,
        date: dayjs(task.date),
        time: dayjs(`2000-01-01T${task.time}`),
        category: task.category,
        priority: task.priority,
        description: task.description || ''
      });
    }
  }, [task]);

  const handleSave = () => {
    if (!formData.title.trim()) return;
    
    onSave({
      ...formData,
      date: formData.date.format('YYYY-MM-DD'),
      time: formData.time.format('HH:mm')
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog 
        open={open} 
        onClose={onClose} 
        fullWidth 
        maxWidth="sm"
        PaperProps={{
          sx: { borderRadius: '20px', p: 1 }
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 2, pb: 1 }}>
          <Box sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: 'primary.main', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <EditRoundedIcon fontSize="small" />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>Edit Task</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Refine your plan for excellence.</Typography>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ mt: 2 }}>
          <Stack spacing={4}>
            <TextField
              fullWidth
              label="Task Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Due Date"
                  value={formData.date}
                  onChange={(v) => setFormData({ ...formData, date: v })}
                  format="DD/MM/YYYY"
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TimePicker
                  label="Time"
                  value={formData.time}
                  onChange={(v) => setFormData({ ...formData, time: v })}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {CATEGORIES.map((cat) => (
                    <MenuItem key={cat.value} value={cat.value}>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>{cat.emoji} {cat.label}</Typography>
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Priority"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                >
                  {PRIORITIES.map((pri) => (
                    <MenuItem key={pri.value} value={pri.value}>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: pri.color }} />
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>{pri.label}</Typography>
                      </Stack>
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>

            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button onClick={onClose} sx={{ fontWeight: 700, color: 'text.secondary' }}>Cancel</Button>
          <Button 
            onClick={handleSave} 
            variant="contained" 
            disableElevation 
            sx={{ borderRadius: '10px', px: 4 }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}

export default EditTaskDialog;
