import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Paper,
  Stack,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  useTheme,
  alpha
} from '@mui/material';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import CheckBoxOutlineBlankRoundedIcon from '@mui/icons-material/CheckBoxOutlineBlankRounded';
import CheckBoxRoundedIcon from '@mui/icons-material/CheckBoxRounded';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';

function TaskList({ tasks, toggleComplete, deleteTask, onEdit, view }) {
  const muiTheme = useTheme();
  const [deleteId, setDeleteId] = useState(null);

  const confirmDelete = (id) => {
    setDeleteId(id);
  };

  const handleConfirmDelete = () => {
    deleteTask(deleteId);
    setDeleteId(null);
  };

  if (tasks.length === 0) {
    return (
      <Paper variant="outlined" sx={{ p: 8, textAlign: 'center', borderColor: 'divider', bgcolor: alpha(muiTheme.palette.text.primary, 0.01), borderStyle: 'dashed' }}>
        <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 600 }}>
          No tasks found for "{view}". Time to plan something new?
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      <Stack spacing={2}>
        {tasks.map((task) => (
          <Paper
            key={task.id}
            elevation={0}
            sx={{
              p: { xs: 2, md: 3 },
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: '16px',
              transition: 'all 0.2s',
              '&:hover': { 
                borderColor: 'primary.main', 
                bgcolor: alpha(muiTheme.palette.primary.main, 0.01),
                transform: 'translateX(4px)'
              }
            }}
          >
            {/* 4. COMPLETE TOGGLE */}
            <IconButton 
              onClick={() => toggleComplete(task.id)} 
              sx={{ color: task.completed ? "success.main" : "divider" }}
            >
              {task.completed ? <CheckBoxRoundedIcon sx={{ fontSize: 28 }} /> : <CheckBoxOutlineBlankRoundedIcon sx={{ fontSize: 28 }} />}
            </IconButton>

            <Box sx={{ flex: 1 }}>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 700,
                  textDecoration: task.completed ? 'line-through' : 'none',
                  color: task.completed ? 'text.secondary' : 'text.primary',
                  letterSpacing: '-0.01em'
                }}
              >
                {task.title}
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center" mt={0.5} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                  {task.time} · {new Date(task.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </Typography>
                <Chip 
                  label={task.category} 
                  size="small" 
                  sx={{ height: 18, fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase', bgcolor: alpha(muiTheme.palette.primary.main, 0.05), color: 'primary.main' }} 
                />
              </Stack>
            </Box>

            <Stack direction="row" spacing={1}>
              {/* 2. EDIT TASK BUTTON */}
              <IconButton size="small" onClick={() => onEdit(task)} sx={{ color: 'text.secondary' }}>
                <EditRoundedIcon fontSize="small" />
              </IconButton>
              
              {/* 3. DELETE TASK BUTTON */}
              <IconButton size="small" onClick={() => confirmDelete(task.id)} sx={{ color: 'error.main' }}>
                <DeleteOutlineRoundedIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Paper>
        ))}
      </Stack>

      {/* DELETE CONFIRMATION DIALOG */}
      <Dialog 
        open={!!deleteId} 
        onClose={() => setDeleteId(null)}
        PaperProps={{ sx: { borderRadius: '16px' } }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <WarningRoundedIcon color="error" />
          Confirm Deletion
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Are you sure you want to delete this task? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteId(null)} sx={{ color: 'text.secondary', fontWeight: 700 }}>Cancel</Button>
          <Button onClick={handleConfirmDelete} variant="contained" color="error" disableElevation sx={{ borderRadius: '8px' }}>
            Delete Task
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default TaskList;
