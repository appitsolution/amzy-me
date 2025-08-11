import React from "react";
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box component="footer" sx={{ 
      width: '100%', 
      borderTop: '1px solid #F2F2F2', 
      py: isMobile ? 2 : 3, 
      px: { xs: 2, md: 4 }, 
      display: 'flex', 
      flexDirection: isMobile ? 'column' : 'row',
      alignItems: isMobile ? 'center' : 'center', 
      justifyContent: isMobile ? 'center' : 'space-between', 
      gap: isMobile ? 2 : 0,
      fontSize: 14, 
      color: '#888', 
      position: 'relative', 
      bottom: 0, 
      left: 0,
      background: 'none',
    }}>
      <Stack 
        direction="row" 
        spacing={isMobile ? 2 : 3} 
        sx={{ 
          alignItems: 'center',
          justifyContent: isMobile ? 'center' : 'flex-start'
        }}
      >
        <Link 
          href="https://docs.google.com/document/d/1ObSmhxE8967AjPis9tPUuFHHGxfMoEdmZuy4gcaU-3Q/edit?usp=sharing" 
          underline="none" 
          sx={{ color: '#888', fontSize: 14 }} 
          target="_blank" 
          rel="noopener noreferrer"
        >
          Privacy Policy
        </Link>
        <Link 
          href="https://docs.google.com/document/d/1t19RgID4nwlvANcK1gDJSFrXtn2m65V6/edit?usp=sharing&ouid=108826075963447222756&rtpof=true&sd=true" 
          underline="none" 
          sx={{ color: '#888', fontSize: 14 }} 
          target="_blank" 
          rel="noopener noreferrer"
        >
          Terms of Service
        </Link>
        <Link 
          href="/support" 
          underline="none" 
          sx={{ color: '#888', fontSize: 14 }}
        >
          Support
        </Link>
      </Stack>
      <Typography sx={{ 
        color: '#888',
        textAlign: isMobile ? 'center' : 'right'
      }}>
        © {new Date().getFullYear()} Amzy LLC
      </Typography>
    </Box>
  );
};

export default Footer; 