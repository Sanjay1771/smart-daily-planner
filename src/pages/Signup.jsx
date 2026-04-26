import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  Alert,
  CircularProgress,
  useTheme as useMuiTheme,
  alpha,
  Container,
} from '@mui/material';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import { supabase } from '../supabaseClient';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const muiTheme = useMuiTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      // 1. Create account
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { name: name.trim() }
        }
      });

      if (signUpError) {
        setLoading(false);
        setError(signUpError.message);
        return;
      }

      // 2. IMMEDIATELY Sign Out
      // This is crucial to prevent the global auth state from auto-redirecting to Dashboard.
      await supabase.auth.signOut();

      // 3. Clear loading and Navigate
      setLoading(false);
      navigate('/login', { 
        replace: true, // Replace history to prevent going back to signup
        state: { message: 'Account created! Please sign in with your credentials.' } 
      });
    } catch (err) {
      setLoading(false);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      minHeight: '100vh',
      bgcolor: 'background.default',
      alignItems: 'center',
      justifyContent: 'center',
      p: 3
    }}>
      <Container maxWidth="xs">
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              bgcolor: 'primary.main',
              color: 'white',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
              boxShadow: `0 10px 20px -5px ${alpha(muiTheme.palette.primary.main, 0.5)}`,
              transform: 'rotate(-5deg)',
            }}
          >
            <BoltRoundedIcon sx={{ fontSize: 36 }} />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 900, color: 'text.primary', letterSpacing: '-0.04em' }}>
            Create Account
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 700, mt: 1 }}>
            Join the PlanPro workspace today.
          </Typography>
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: 5,
            borderRadius: '16px',
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: muiTheme.palette.mode === 'light' ? '0 25px 50px -12px rgba(0, 0, 0, 0.08)' : 'none',
          }}
        >
          {error && (
            <Alert severity="error" sx={{ mb: 4, borderRadius: '10px', fontWeight: 700, fontSize: '0.85rem' }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Full Name"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <TextField
                fullWidth
                label="Email Address"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <TextField
                fullWidth
                type={showPassword ? 'text' : 'password'}
                label="Password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                        {showPassword ? <VisibilityOffRoundedIcon fontSize="small" /> : <VisibilityRoundedIcon fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                type={showPassword ? 'text' : 'password'}
                label="Confirm Password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              <Button
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                disableElevation
                disabled={loading}
                sx={{
                  py: 1.5,
                  borderRadius: '10px',
                  fontWeight: 900,
                  fontSize: '0.95rem',
                  mt: 1
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Get Started'}
              </Button>
            </Stack>
          </Box>
        </Paper>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 700 }}>
            Already have an account?{' '}
            <Link
              component={RouterLink}
              to="/login"
              sx={{ color: 'primary.main', textDecoration: 'none', fontWeight: 900, '&:hover': { textDecoration: 'underline' } }}
            >
              Sign in.
            </Link>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default Signup;
