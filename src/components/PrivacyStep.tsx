import React from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useBooking } from '../context/BookingContext';
import { useApi } from '../hooks/useApi';
import { cleanPhoneNumber } from '../utils/validation';

interface PrivacyStepProps {
  onContinue: () => void;
  onBack?: () => void;
}

export default function PrivacyStep({ onContinue, onBack }: PrivacyStepProps) {
  const [checked, setChecked] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const { state } = useBooking();
  const { sendPhoneAuthCode } = useApi();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box sx={{ minHeight: isMobile ? '80vh' : '72vh', display: 'flex', alignItems: 'center', justifyContent: 'center', px: isMobile ? 1 : 0 }}>
      <Box sx={{ maxWidth: 800, width: '100%', textAlign: 'center', pt: isMobile ? 4 : 0 }}>
        <Typography variant="h2" sx={{ color: '#323232', fontWeight: 500, fontSize: isMobile ? 24 : { xs: 32, md: 36 }, mb: isMobile ? 2 : 3, lineHeight: 1.1 }}>
          Accept the Terms of Service and review<br />AMZY&apos;s Privacy Statement
        </Typography>
        <Typography sx={{ color: '#444', fontSize: isMobile ? 14 : 16, mb: isMobile ? 2 : 4, lineHeight: 1.4 }}>
          By Checking the box, you agree to receive text messages from Amzy related to your order status, person &amp; login verification and help external links. Message &amp; data rates may apply. Message frequency varies by usage. Reply HELP for help and STOP to cancel.
        </Typography>
        <Stack direction="row" spacing={isMobile ? 2 : 6} justifyContent="center" alignItems="center" sx={{ mb: isMobile ? 2 : 3 }}>
          <span style={{ color: '#D94F04', fontSize: isMobile ? 18 : 24 }}>&bull;</span>
          <Link href="https://docs.google.com/document/d/1t19RgID4nwlvANcK1gDJSFrXtn2m65V6/edit?usp=sharing&ouid=108826075963447222756&rtpof=true&sd=true" sx={{ color: '#D94F04', fontSize: isMobile ? 15 : 18, fontWeight: 500, textDecoration: 'none' }}>Terms of Use</Link>
          <span style={{ color: '#D94F04', fontSize: isMobile ? 18 : 24 }}>&bull;</span>
          <Link href="https://docs.google.com/document/d/1ObSmhxE8967AjPis9tPUuFHHGxfMoEdmZuy4gcaU-3Q/edit?usp=sharing" sx={{ color: '#D94F04', fontSize: isMobile ? 15 : 18, fontWeight: 500, textDecoration: 'none' }}>Privacy Statement</Link>
        </Stack>
        <Stack direction="row" justifyContent="center" alignItems="center" sx={{ mb: isMobile ? 3 : 5 }}>
          <FormControlLabel
            control={<Checkbox checked={checked} onChange={e => setChecked(e.target.checked)} sx={{ color: '#D94F04', '&.Mui-checked': { color: '#D94F04' }, transform: isMobile ? 'scale(1.3)' : 'none' }} />}
            label={<Typography sx={{ fontSize: isMobile ? 18 : 18, fontWeight: 100, color: '#323232' }}>Accept</Typography>}
            sx={{
              '.MuiFormControlLabel-label': { fontSize: isMobile ? 18 : 18 },
              ml: isMobile ? 0 : 1
            }}
          />
        </Stack>
        <Stack direction="row" spacing={isMobile ? 2 : 4} justifyContent="center" sx={{ mt: isMobile ? 0 : 2 }}>
          <Button 
            variant="outlined" 
            sx={{ 
              minWidth: isMobile ? 120 : 120, 
              width: isMobile ? 140 : 120,
              fontSize: isMobile ? 18 : 20, 
              borderRadius: 2, 
              color: '#BDBDBD', 
              borderColor: '#E0E0E0', 
              background: 'white', 
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: 1, 
              textTransform: 'none',
              px: isMobile ? 0 : 2,
              py: isMobile ? 1.2 : 1
            }}
            onClick={onBack}
          >
            <svg xmlns="http://www.w3.org/2000/svg" style={{ transform: 'rotate(180deg)', marginRight: '8px' }} width="8" height="14" viewBox="0 0 8 14" fill="gray">
              <path d="M7.69229 7.44217L1.44229 13.6922C1.38422 13.7502 1.31528 13.7963 1.23941 13.8277C1.16354 13.8592 1.08223 13.8753 1.0001 13.8753C0.917982 13.8753 0.836664 13.8592 0.760793 13.8277C0.684922 13.7963 0.615984 13.7502 0.557916 13.6922C0.499847 13.6341 0.453784 13.5652 0.422357 13.4893C0.390931 13.4134 0.374756 13.3321 0.374756 13.25C0.374756 13.1679 0.390931 13.0865 0.422357 13.0107C0.453784 12.9348 0.499847 12.8659 0.557916 12.8078L6.36651 6.99998L0.557916 1.19217C0.44064 1.07489 0.374756 0.915834 0.374756 0.749981C0.374756 0.584129 0.44064 0.425069 0.557916 0.307794C0.675191 0.190518 0.834251 0.124634 1.0001 0.124634C1.16596 0.124634 1.32502 0.190518 1.44229 0.307794L7.69229 6.55779C7.7504 6.61584 7.7965 6.68477 7.82795 6.76064C7.85941 6.83652 7.87559 6.91785 7.87559 6.99998C7.87559 7.08212 7.85941 7.16344 7.82795 7.23932C7.7965 7.31519 7.7504 7.38412 7.69229 7.44217Z" fill="gray"/>
            </svg>
            Back
          </Button>
          <Button 
            variant="contained" 
            disabled={!checked || loading} 
            onClick={async () => {
              if (!checked) return;
              
              setLoading(true);
              try {
                const cleanPhone = cleanPhoneNumber(state.phoneNumber);
                await sendPhoneAuthCode(cleanPhone);
                onContinue();
              } catch (error) {
                console.error('Failed to send SMS:', error);
                // Можно добавить уведомление об ошибке
              } finally {
                setLoading(false);
              }
            }}
            sx={{ 
              minWidth: isMobile ? 120 : 120, 
              width: isMobile ? 140 : 120,
              fontSize: isMobile ? 18 : 20, 
              borderRadius: 2, 
              background: '#D94F04', 
              color: '#fff', 
              fontWeight: 500, 
              '&:hover': { background: '#b53e02' },
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              textTransform: 'none',
              px: isMobile ? 0 : 2,
              py: isMobile ? 1.2 : 1
            }}
          >
            {loading ? 'Sending...' : 'Next'}
            <svg xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: '8px' }} width="8" height="14" viewBox="0 0 8 14" fill={checked ? 'white' : 'gray'}>
              <path d="M7.69229 7.44217L1.44229 13.6922C1.38422 13.7502 1.31528 13.7963 1.23941 13.8277C1.16354 13.8592 1.08223 13.8753 1.0001 13.8753C0.917982 13.8753 0.836664 13.8592 0.760793 13.8277C0.684922 13.7963 0.615984 13.7502 0.557916 13.6922C0.499847 13.6341 0.453784 13.5652 0.422357 13.4893C0.390931 13.4134 0.374756 13.3321 0.374756 13.25C0.374756 13.1679 0.390931 13.0865 0.422357 13.0107C0.453784 12.9348 0.499847 12.8659 0.557916 12.8078L6.36651 6.99998L0.557916 1.19217C0.44064 1.07489 0.374756 0.915834 0.374756 0.749981C0.374756 0.584129 0.44064 0.425069 0.557916 0.307794C0.675191 0.190518 0.834251 0.124634 1.0001 0.124634C1.16596 0.124634 1.32502 0.190518 1.44229 0.307794L7.69229 6.55779C7.7504 6.61584 7.7965 6.68477 7.82795 6.76064C7.85941 6.83652 7.87559 6.91785 7.87559 6.99998C7.87559 7.08212 7.85941 7.16344 7.82795 7.23932C7.7965 7.31519 7.7504 7.38412 7.69229 7.44217Z" fill={checked ? 'white' : 'gray'}/>
            </svg>
          </Button>
        </Stack>
      </Box>
    </Box>
  );
} 