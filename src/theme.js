import { alpha } from '@mui/material/styles';

const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // Apple Premium Color System (Restored)
          primary: {
            main: '#0071E3', // Apple Blue
            contrastText: '#FFFFFF',
          },
          secondary: {
            main: '#64748B', // Slate Gray
          },
          background: {
            default: '#F8FAFC', // Notion/Apple Body
            paper: '#FFFFFF',
          },
          text: {
            primary: '#0F172A', // Slate 900
            secondary: '#64748B', // Slate 500
          },
          divider: '#E5E7EB', // Slate 200
          success: {
            main: '#10B981',
          },
          warning: {
            main: '#F59E0B',
          },
          error: {
            main: '#EF4444',
          },
        }
      : {
          // Apple Dark Mode System (Restored)
          primary: {
            main: '#0A84FF', // Apple Blue (Dark)
            contrastText: '#FFFFFF',
          },
          secondary: {
            main: '#AEAEB2',
          },
          background: {
            default: '#000000', // True Black
            paper: '#1C1C1E', // Dark Gray Card
          },
          text: {
            primary: '#FFFFFF',
            secondary: '#AEAEB2',
          },
          divider: '#2C2C2E',
          success: {
            main: '#32D74B',
          },
          warning: {
            main: '#FF9F0A',
          },
          error: {
            main: '#FF453A',
          },
        }),
  },
  shape: {
    borderRadius: 20, // Premium rounded corners
  },
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      'sans-serif',
    ].join(','),
    h1: { fontWeight: 800, letterSpacing: '-0.04em' },
    h2: { fontWeight: 800, letterSpacing: '-0.03em' },
    h3: { fontWeight: 800, letterSpacing: '-0.03em' },
    h4: { fontWeight: 800, letterSpacing: '-0.02em' },
    h5: { fontWeight: 700, letterSpacing: '-0.01em' },
    h6: { fontWeight: 700, letterSpacing: '-0.01em' },
    subtitle1: { fontWeight: 600 },
    body1: { fontSize: '1rem', lineHeight: 1.6 },
    button: { textTransform: 'none', fontWeight: 700 },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: mode === 'light' ? '#FFFFFF' : '#000000',
          color: mode === 'light' ? '#0F172A' : '#FFFFFF',
          borderBottom: mode === 'light' ? '1px solid #E5E7EB' : '1px solid #1C1C1E',
          boxShadow: mode === 'light' ? '0 1px 2px rgba(0,0,0,0.03)' : 'none',
          backgroundImage: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 24px',
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          textTransform: 'none',
          fontWeight: 700,
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: mode === 'light' 
              ? '0 6px 16px rgba(0,113,227,0.15)' 
              : '0 6px 16px rgba(10,132,255,0.25)',
            filter: 'brightness(1.05)',
          },
          '&:active': {
            transform: 'translateY(0)',
          }
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          border: '1px solid',
          borderColor: mode === 'light' ? '#E5E7EB' : '#2C2C2E',
          boxShadow: 'none',
          backgroundImage: 'none',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px) scale(1.005)',
            boxShadow: mode === 'light' 
              ? '0 12px 30px rgba(0,0,0,0.08)' 
              : '0 12px 30px rgba(0,0,0,0.4)',
            borderColor: mode === 'light' ? '#0071E3' : '#0A84FF',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

export default getDesignTokens;
