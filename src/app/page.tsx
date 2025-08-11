"use client";

import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BookingForm from '@/components/BookingForm';
import PrivacyStep from '@/components/PrivacyStep';
import PhoneVerifyStep from '@/components/PhoneVerifyStep';
import JunkAmountStep from '@/components/JunkAmountStep';
import DateTimeStep from '@/components/DateTimeStep';
import BookingSubmitted from '@/components/BookingSubmitted';
import { BookingProvider } from '@/context/BookingContext';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

type Step = 'homepage' | 'privacystep' | 'phoneverifystep' | 'junkamountstep' | 'datetimestep' | 'bookingsubmitted';

export default function HomePage() {
  const [currentStep, setCurrentStep] = useState<Step>('homepage');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const renderStep = () => {
    switch (currentStep) {
      case 'homepage':
        return (
          <main style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            minHeight: 'calc(100vh - 180px)',
            padding: isMobile ? '0px' : '40px 20px'
          }}>
            <div style={{ 
              display: 'flex', 
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: isMobile ? 'stretch' : 'flex-end', 
              gap: isMobile ? '32px' : '60px',
              maxWidth: '1200px',
              width: '100%'
            }}>
              {/* Левая часть с видео */}
              <div style={{ 
                flex: isMobile ? 'none' : 1, 
                maxWidth: isMobile ? '100%' : '600px',
                order: isMobile ? 1 : 1
              }}>
                <video 
                  autoPlay 
                  loop 
                  muted 
                  style={{ 
                    width: '100%', 
                    height: 'auto',
                    borderRadius: isMobile ? '0' : '12px',
                    boxShadow: isMobile ? 'none' : '0 8px 32px rgba(0,0,0,0.1)'
                  }}
                >
                  <source src="/video.mp4" type="video/mp4" />
                  Ваш браузер не поддерживает видео.
                </video>
              </div>
              
              {/* Правая часть с формой */}
              <div style={{ 
                flex: isMobile ? 'none' : 1, 
                display: 'flex', 
                justifyContent: 'center',
                order: isMobile ? 2 : 2
              }}>
                <BookingForm onContinue={() => setCurrentStep('privacystep')} />
              </div>
            </div>
          </main>
        );
      
      case 'privacystep':
        return (
          <main style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            padding: isMobile ? '20px 16px' : '40px 20px'
          }}>
            <PrivacyStep onContinue={() => setCurrentStep('phoneverifystep')} onBack={() => setCurrentStep('homepage')} />
          </main>
        );
      
      case 'phoneverifystep':
        return (
          <main style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            minHeight: 'calc(100vh - 180px)',
            padding: isMobile ? '20px 16px' : '40px 20px'
          }}>
            <PhoneVerifyStep 
              onContinue={() => setCurrentStep('junkamountstep')} 
              onBack={() => setCurrentStep('homepage')} 
            />
          </main>
        );
      
      case 'junkamountstep':
        return (
          <main style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            minHeight: 'calc(100vh - 180px)',
            padding: isMobile ? '20px 16px' : '40px 20px'
          }}>
            <JunkAmountStep onContinue={() => setCurrentStep('datetimestep')} onBack={() => setCurrentStep('homepage')} />
          </main>
        );
      
      case 'datetimestep':
        return (
          <main style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            minHeight: 'calc(100vh - 180px)',
            padding: isMobile ? '20px 16px' : '40px 20px'
          }}>
            <DateTimeStep onContinue={() => setCurrentStep('bookingsubmitted')} onBack={() => setCurrentStep('junkamountstep')} onHomepage={() => setCurrentStep('homepage')} />
          </main>
        );
      
      case 'bookingsubmitted':
        return (
          <main style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            minHeight: 'calc(100vh - 180px)',
            padding: isMobile ? '20px 16px' : '40px 20px'
          }}>
            <BookingSubmitted />
          </main>
        );
      
      default:
        return null;
    }
  };

  return (
    <BookingProvider>
      <div>
        <Header />
        {renderStep()}
        <Footer />
      </div>
    </BookingProvider>
  );
}
