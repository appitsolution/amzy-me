"use client";

import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';

const SupportPage = () => {
  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <Header />
      <main style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: 'calc(100vh - 200px)',
        padding: '40px 20px'
      }}>
        <Container maxWidth="md">
          <Paper
            elevation={8}
            sx={{
              p: { xs: 3, md: 6 },
              borderRadius: 3,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              sx={{
                textAlign: 'center',
                fontWeight: 700,
                color: '#FF8C00',
                mb: 4,
              }}
            >
              Contact Us
            </Typography>
            
            <Typography
              variant="h6"
              sx={{
                textAlign: 'center',
                color: '#666',
                mb: 4,
                lineHeight: 1.6,
              }}
            >
              We&apos;re here to help! If you have any questions, need support, or just want to get in touch, feel free to reach out to us via phone or email.
            </Typography>

            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                gap: 4,
                justifyContent: 'center',
                alignItems: 'center',
                mt: 4,
              }}
            >
              <Paper
                elevation={3}
                component="a"
                href="tel:+12532347078"
                sx={{
                  p: 3,
                  borderRadius: 2,
                  textAlign: 'center',
                  minWidth: 250,
                  textDecoration: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(255, 140, 0, 0.3)',
                  },
                }}
              >
                <PhoneIcon sx={{ fontSize: 40, color: '#FF8C00', mb: 2 }} />
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#333' }}>
                  Phone
                </Typography>
                <Typography variant="body1" sx={{ color: '#666' }}>
                  (253) 234-7078
                </Typography>
              </Paper>

              <Paper
                elevation={3}
                component="a"
                href="mailto:?to=contact@amzy.me&subject=Support%20Request"
                sx={{
                  p: 3,
                  borderRadius: 2,
                  textAlign: 'center',
                  minWidth: 250,
                  textDecoration: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(255, 140, 0, 0.3)',
                  },
                }}
              >
                <EmailIcon sx={{ fontSize: 40, color: '#FF8C00', mb: 2 }} />
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#333' }}>
                  Email
                </Typography>
                <Typography variant="body1" sx={{ color: '#666' }}>
                  contact@amzy.me
                </Typography>
              </Paper>
            </Box>

            <Typography
              variant="body1"
              sx={{
                textAlign: 'center',
                color: '#666',
                mt: 4,
                lineHeight: 1.6,
              }}
            >
              We aim to respond to all inquiries as quickly as possible during our business hours.
            </Typography>

            <Typography
              variant="h6"
              sx={{
                textAlign: 'center',
                color: '#FF8C00',
                mt: 3,
                fontWeight: 600,
              }}
            >
              Thank you for reaching out!
            </Typography>
          </Paper>
        </Container>
      </main>
      <Footer />
    </div>
  );
};

export default SupportPage; 