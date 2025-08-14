import React from "react";
import Image from 'next/image';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Link from "next/link";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useBooking } from '../context/BookingContext';
import type { BookingAction } from '../context/BookingContext';

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Безопасное использование контекста
  let dispatch: React.Dispatch<BookingAction> | null = null;
  try {
    const bookingContext = useBooking();
    dispatch = bookingContext.dispatch;
  } catch {
    // Контекст недоступен, это нормально для некоторых страниц
  }

  return (
    <AppBar position="static" elevation={0} sx={{ background: 'none', borderBottom: '1px solid #F2F2F2', boxShadow: 'none' }}>
      <Toolbar sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        px: isMobile ? 2 : { xs: 2, md: 5 }, 
        py: isMobile ? 2 : 3 
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center' }} >
          <Image 
            src="/logo.svg" 
            alt="AMZY Logo" 
            width={isMobile ? 100 : 128}
            height={isMobile ? 50 : 68}
            style={{ 
              marginRight: isMobile ? 12 : 16 
            }} 
          />
        </Link>
        
      </Toolbar>
    </AppBar>
  );
};

export default Header; 