'use client';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import React from 'react';

const theme = createTheme({
  typography: {
    fontFamily: 'Montserrat, sans-serif',
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
} 