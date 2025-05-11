// frontend/src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Example primary color (Material UI blue)
    },
    secondary: {
      main: '#dc004e', // Example secondary color (Material UI pink)
    },
    background: {
      default: '#f4f6f8', // A light grey background
      paper: '#ffffff',   // White for paper elements like cards
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.2rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '1.8rem',
      fontWeight: 500,
    },
     h3: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    // ... you can customize other typography variants
  },
  // You can also customize components globally
  // components: {
  //   MuiButton: {
  //     styleOverrides: {
  //       root: {
  //         textTransform: 'none', // Example: disable uppercase on buttons
  //       },
  //     },
  //   },
  // },
});

export default theme;