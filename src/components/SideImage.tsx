import React from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const SideImage = () => (
  <Box sx={{ width: 480, height: 400, borderRadius: 3, overflow: 'hidden', position: 'relative', bgcolor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <Box component="img" src="/AMZY_Home.png" alt="AMZY Home" sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    <Box sx={{
      position: 'absolute',
      right: 32,
      top: 120,
      width: 220,
      height: 220,
      bgcolor: '#FFD600',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 24px rgba(0,0,0,0.10)'
    }}>
      <Typography sx={{ color: '#D94F04', fontWeight: 700, fontSize: 32, textAlign: 'center', lineHeight: 1.2 }}>
        $185<br />per<br />Pickup load<br />depending<br />on weight
      </Typography>
    </Box>
  </Box>
);

export default SideImage; 