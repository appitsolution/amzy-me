import React from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

export default function BookingSubmitted() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box sx={{ minHeight:'75vh', display: 'flex', alignItems: 'center', justifyContent: 'center', px: isMobile ? 2 : 0 }}>
      <Box sx={{ width: '100%', maxWidth: isMobile ? '100%' : 900, textAlign: 'center' }}>
        <Typography variant="h2" color="#323232" sx={{ fontWeight: 600, fontSize: isMobile ? 28 : { xs: 32, md: 48 }, mb: isMobile ? 1.5 : 2, lineHeight: 1.1 }}>
          Booking request<br></br>submitted
        </Typography>
        <Typography sx={{ color: '#323232', fontSize: isMobile ? 14 : 16, mb: isMobile ? 3 : 5, mt: isMobile ? 1 : 2, lineHeight: 1.3 }}>
          Download our app for instant access to your order details. Easily track progress, make updates, and receive important notifications—all in one place.
        </Typography>
        <Stack direction={isMobile ? 'column' : 'row'} spacing={isMobile ? 2 : 4} justifyContent="center" alignItems="center" sx={{ mt: isMobile ? 2 : 4 }}>
          <Box component="a" href="https://apps.apple.com/us/app/amzy/id1206857095" target="_blank" rel="noopener noreferrer" sx={{ display: 'inline-block', border: '2px solid #222', borderRadius: 2, px: isMobile ? 1 : 2.5, py: isMobile ? 0.8 : 1, bgcolor: '#fff', color: '#222', fontWeight: 600, fontSize: isMobile ? 16 : 22, textDecoration: 'none', minWidth: isMobile ? '100%' : 200 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
            <Box component="span" sx={{ fontSize: 36, mr: 1 }}></Box>
              <Box>
                <Typography sx={{ fontSize: isMobile ? 10 : 12, fontWeight: 400, lineHeight: 1 }}>Download on the</Typography>
                <Typography sx={{ fontSize: isMobile ? 18 : 22, fontWeight: 600, lineHeight: 1 }}>App Store</Typography>
              </Box>
            </Box>
          </Box>
          <Box component="a" href="#" sx={{ display: 'inline-block', border: '2px solid #222', borderRadius: 2, px: isMobile ? 2 : 2.5, py: isMobile ? 1.5 : 1, bgcolor: '#fff', color: '#222', fontWeight: 600, fontSize: isMobile ? 16 : 22, textDecoration: 'none', minWidth: isMobile ? '100%' : 200, maxWidth: isMobile ? 80 : 'none' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <Box component="span" sx={{ fontSize: isMobile ? 28 : 36, mr: 1 }}>
                <svg fill="#000000" width={isMobile ? "18px" : "22px"} height={isMobile ? "18px" : "22px"} viewBox="-1 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="m3.751.61 13.124 7.546-2.813 2.813zm-2.719-.61 12.047 12-12.046 12c-.613-.271-1.033-.874-1.033-1.575 0-.023 0-.046.001-.068v.003-20.719c-.001-.019-.001-.042-.001-.065 0-.701.42-1.304 1.022-1.571l.011-.004zm19.922 10.594c.414.307.679.795.679 1.344 0 .022 0 .043-.001.065v-.003c.004.043.007.094.007.145 0 .516-.25.974-.636 1.258l-.004.003-2.813 1.593-3.046-2.999 3.047-3.047zm-17.203 12.796 10.312-10.359 2.813 2.813z"/>
                </svg>
              </Box>
              <Box>
                <Typography sx={{ fontSize: isMobile ? 10 : 12, fontWeight: 400, lineHeight: 1 }}>Get it on</Typography>
                <Typography sx={{ fontSize: isMobile ? 18 : 22, fontWeight: 600, lineHeight: 1 }}>Google Play</Typography>
              </Box>
            </Box>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
} 