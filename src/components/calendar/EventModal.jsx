import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Button, 
  Stack, 
  Typography, 
  IconButton, 
  Box, 
  alpha,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  useTheme
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

function EventModal({ isOpen, onClose, onSave, onDelete, initialData, defaultDate }) {
  const theme = useTheme();
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [category, setCategory] = useState('work');

  const categories = [
    { id: 'work', label: 'Work', color: theme.palette.primary.main },
    { id: 'personal', label: 'Personal', color: '#AF52DE' },
    { id: 'gym', label: 'Gym', color: theme.palette.success.main },
    { id: 'study', label: 'Study', color: theme.palette.warning.main },
    { id: 'health', label: 'Health', color: theme.palette.error.main },
  ];

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setTitle(initialData.title || '');
        setDate(initialData.event_date || initialData.date || '');
        setTime(initialData.start_time || initialData.time || '');
        setCategory(initialData.category?.toLowerCase() || 'work');
      } else {
        setTitle('');
        setDate(defaultDate || new Date().toISOString().split('T')[0]);
        const now = new Date();
        now.setMinutes(Math.ceil(now.getMinutes() / 30) * 30);
        setTime(now.toTimeString().slice(0, 5));
        setCategory('work');
      }
    }
  }, [isOpen, initialData, defaultDate]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!title.trim() || !date) return;
    
    onSave({
      ...(initialData || {}),
      title: title.trim(),
      date,
      time,
      category: category.toUpperCase(),
      completed: initialData ? initialData.completed : false
    });
  };

  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose}
      PaperProps={{ 
        sx: { 
          borderRadius: '24px', 
          bgcolor: 'background.paper', 
          border: '1px solid',
          borderColor: 'divider', 
          backgroundImage: 'none', 
          minWidth: '400px' 
        } 
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 3, pt: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
          {initialData ? 'Edit Task' : 'New Task'}
        </Typography>
        <IconButton onClick={onClose} sx={{ color: 'text.secondary' }}><CloseRoundedIcon /></IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ px: 3, pb: 2 }}>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <TextField
            fullWidth
            placeholder="Event Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                color: 'text.primary',
                bgcolor: alpha(theme.palette.text.primary, 0.02),
                borderRadius: '12px',
                '& fieldset': { borderColor: 'divider' },
                '&:hover fieldset': { borderColor: alpha(theme.palette.primary.main, 0.5) },
                '&.Mui-focused fieldset': { borderColor: 'primary.main' },
              }
            }}
          />

          <Stack direction="row" spacing={2}>
            <TextField
              type="date"
              fullWidth
              value={date}
              onChange={e => setDate(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'text.primary',
                  bgcolor: alpha(theme.palette.text.primary, 0.02),
                  borderRadius: '12px',
                  '& fieldset': { borderColor: 'divider' },
                }
              }}
            />
            <TextField
              type="time"
              fullWidth
              value={time}
              onChange={e => setTime(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'text.primary',
                  bgcolor: alpha(theme.palette.text.primary, 0.02),
                  borderRadius: '12px',
                  '& fieldset': { borderColor: 'divider' },
                }
              }}
            />
          </Stack>

          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, mb: 1, display: 'block' }}>CATEGORY</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {categories.map(cat => (
                <Box
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  sx={{
                    px: 2, py: 1, borderRadius: '10px', border: '1px solid',
                    borderColor: category === cat.id ? cat.color : 'divider',
                    bgcolor: category === cat.id ? alpha(cat.color, 0.1) : 'transparent',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 1,
                    transition: 'all 0.2s ease',
                    '&:hover': { bgcolor: alpha(cat.color, 0.05) }
                  }}
                >
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: cat.color }} />
                  <Typography sx={{ fontSize: '12px', fontWeight: 700, color: category === cat.id ? 'text.primary' : 'text.secondary' }}>
                    {cat.label}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 2, justifyContent: 'space-between' }}>
        {initialData ? (
          <Button 
            onClick={() => onDelete(initialData.id)} 
            sx={{ color: 'error.main', fontWeight: 700, textTransform: 'none' }}
          >
            Delete
          </Button>
        ) : <Box />}
        
        <Stack direction="row" spacing={2}>
          <Button onClick={onClose} sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'none' }}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            disableElevation
            sx={{ 
              borderRadius: '12px', px: 4, fontWeight: 800, textTransform: 'none',
            }}
          >
            Save
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}

export default EventModal;
