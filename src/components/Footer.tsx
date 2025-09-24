import React from "react";
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import PolicyDialog from './PolicyDialog';

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [dialogOpen, setDialogOpen] = React.useState<null | { title: string; type: 'privacy' | 'terms' }>(null);

  const openDialog = (title: string, type: 'privacy' | 'terms') => setDialogOpen({ title, type });
  const closeDialog = () => setDialogOpen(null);

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
          href="#" 
          underline="none" 
          sx={{ color: '#888', fontSize: 14 }} 
          onClick={(e) => { e.preventDefault(); openDialog('Privacy Policy', 'privacy'); }}
        >
          Privacy Policy
        </Link>
        <Link 
          href="#" 
          underline="none" 
          sx={{ color: '#888', fontSize: 14 }} 
          onClick={(e) => { e.preventDefault(); openDialog('Terms of Service', 'terms'); }}
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
      {dialogOpen && (
        <PolicyDialog 
          open={Boolean(dialogOpen)} 
          title={dialogOpen.title} 
          type={dialogOpen.type} 
          onClose={closeDialog} 
        />
      )}
    </Box>
  );
};

export default Footer; 