import React, { useState } from 'react';
import {
  Paper,
  TextField,
  Button,
  MenuItem,
  Typography,
  Box,
  Stack,
  Grid,
  Divider,
  Collapse,
  IconButton,
  useTheme,
  alpha,
  Chip
} from '@mui/material';
import { DatePicker, TimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';

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

function TaskForm({ addTask }) {
  const muiTheme = useTheme();

  // Form state
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(dayjs());
  const [time, setTime] = useState(dayjs().hour(9).minute(0));
  const [category, setCategory] = useState('work');
  const [priority, setPriority] = useState('medium');
  const [description, setDescription] = useState('');

  // UI state
  const [isExpanded, setIsExpanded] = useState(true);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!title.trim()) errs.title = 'Title is required';
    if (!date || !date.isValid()) errs.date = 'Date is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    addTask({
      title: title.trim(),
      date: date.format('YYYY-MM-DD'),
      time: time && time.isValid() ? time.format('HH:mm') : '09:00',
      category,
      priority,
      description: description.trim(),
    });

    // Reset
    setTitle('');
    setDate(dayjs());
    setTime(dayjs().hour(9).minute(0));
    setCategory('work');
    setPriority('medium');
    setDescription('');
    setErrors({});
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Paper
        elevation={0}
        sx={{
          borderRadius: '14px',
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          overflow: 'hidden',
          boxShadow: muiTheme.palette.mode === 'light' ? '0 4px 12px rgba(0,0,0,0.05)' : 'none',
        }}
      >
        <Box
          onClick={() => setIsExpanded(!isExpanded)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 4,
            py: 2.5,
            cursor: 'pointer',
            userSelect: 'none',
            bgcolor: alpha(muiTheme.palette.primary.main, 0.05),
            transition: 'all 0.2s ease',
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '8px',
                bgcolor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AddRoundedIcon sx={{ color: '#fff', fontSize: 22 }} />
            </Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary' }}>
              Add Task
            </Typography>
          </Stack>
          <IconButton size="small">
            {isExpanded ? <KeyboardArrowUpRoundedIcon /> : <KeyboardArrowDownRoundedIcon />}
          </IconButton>
        </Box>

        <Collapse in={isExpanded}>
          <Box component="form" onSubmit={handleSubmit} sx={{ p: 4 }}>
            <Stack spacing={4}>
              <TextField
                fullWidth
                label="What's on your mind?"
                variant="outlined"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) setErrors((p) => ({ ...p, title: '' }));
                }}
                error={!!errors.title}
                helperText={errors.title}
                required
              />

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="Due Date"
                    value={date}
                    onChange={(v) => setDate(v)}
                    format="DD/MM/YYYY"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        required: true,
                        error: !!errors.date,
                        helperText: errors.date,
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TimePicker
                    label="Time"
                    value={time}
                    onChange={(v) => setTime(v)}
                    slotProps={{
                      textField: { fullWidth: true },
                    }}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    fullWidth
                    label="Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {CATEGORIES.map((cat) => (
                      <MenuItem key={cat.value} value={cat.value} sx={{ py: 1.5 }}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Typography fontSize="1.1rem">{cat.emoji}</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>{cat.label}</Typography>
                        </Stack>
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    fullWidth
                    label="Priority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                  >
                    {PRIORITIES.map((pri) => (
                      <MenuItem key={pri.value} value={pri.value} sx={{ py: 1.5 }}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: pri.color }} />
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
                placeholder="Optional details..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                multiline
                minRows={3}
                maxRows={6}
              />

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 1 }}>
                 <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disableElevation
                  sx={{ px: 5, py: 1.5, borderRadius: '12px' }}
                >
                  Create Task
                </Button>
              </Box>
            </Stack>
          </Box>
        </Collapse>
      </Paper>
    </LocalizationProvider>
  );
}

export default TaskForm;
