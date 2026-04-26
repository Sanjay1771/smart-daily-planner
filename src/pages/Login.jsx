import React, { useState } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
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

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const muiTheme = useMuiTheme();

  // Get success message from signup redirect if it exists
  const successMessage = location.state?.message || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // 1. Validation
    if (!email.trim() || !password.trim()) {
      setError('Both email and password are required.');
      return;
    }

    setLoading(true);

    // 2. Login Logic
    // This checks against Supabase Auth (auth.users)
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password
    });

    setLoading(false);

    if (signInError) {
      // Clear error messages for common issues
      if (signInError.message === 'Invalid login credentials') {
        setError('The email or password you entered is incorrect.');
      } else {
        setError(signInError.message);
      }
      return;
    }

    // 3. SUCCESS: Redirect to Dashboard
    // Persistence is handled automatically by Supabase and App.js
    navigate('/dashboard');
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
            Welcome Back
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 700, mt: 1 }}>
            Sign in with your workspace account.
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
          {/* Show success message from signup */}
          {successMessage && !error && (
            <Alert severity="success" sx={{ mb: 4, borderRadius: '10px', fontWeight: 700, fontSize: '0.85rem' }}>
              {successMessage}
            </Alert>
          )}

          {/* Show error messages */}
          {error && (
            <Alert severity="error" sx={{ mb: 4, borderRadius: '10px', fontWeight: 700, fontSize: '0.85rem' }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />

              <Box>
                <TextField
                  fullWidth
                  type={showPassword ? 'text' : 'password'}
                  label="Password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
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
                <Box sx={{ textAlign: 'right', mt: 1 }}>
                  <Link variant="caption" sx={{ color: 'primary.main', fontWeight: 800, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                    Forgot password?
                  </Link>
                </Box>
              </Box>

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
                  fontSize: '0.95rem'
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
              </Button>
            </Stack>
          </Box>
        </Paper>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 700 }}>
            Don't have an account?{' '}
            <Link
              component={RouterLink}
              to="/signup"
              sx={{ color: 'primary.main', textDecoration: 'none', fontWeight: 900, '&:hover': { textDecoration: 'underline' } }}
            >
              Sign up today.
            </Link>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default Login;
