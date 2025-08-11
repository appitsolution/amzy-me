import React from "react";
import Image from 'next/image';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from "next/link";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <AppBar position="static" elevation={0} sx={{ background: 'none', borderBottom: '1px solid #F2F2F2', boxShadow: 'none' }}>
      <Toolbar sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        px: isMobile ? 2 : { xs: 2, md: 5 }, 
        py: isMobile ? 2 : 3 
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
          <Image 
            src="/logo.svg" 
            alt="AMZY Logo" 
            width={isMobile ? 36 : 128}
            height={isMobile ? 36 : 68}
            style={{ 
              marginRight: isMobile ? 12 : 16 
            }} 
          />
        </Link>
        <Box>
          <Button 
            sx={{ 
              color: '#222', 
              fontSize: isMobile ? 14 : 18, 
              textTransform: 'none', 
              mr: isMobile ? 1.5 : 3 
            }} 
            variant="text"
          >
            login
          </Button>
          <Button 
            sx={{ 
              background: '#D94F04', 
              color: '#fff', 
              fontSize: isMobile ? 14 : 18, 
              textTransform: 'none', 
              borderRadius: 1.5, 
              px: isMobile ? 2 : 3, 
              py: isMobile ? 0.8 : 1.2, 
              '&:hover': { background: '#b53e02' } 
            }} 
            variant="contained"
          >
            Sign up
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 