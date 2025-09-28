"use client";

import { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BookingForm from '@/components/BookingForm';
import PrivacyStep from '@/components/PrivacyStep';
import PhoneVerifyStep from '@/components/PhoneVerifyStep';
import JunkAmountStep from '@/components/JunkAmountStep';
import DateTimeStep from '@/components/DateTimeStep';
import BookingSubmitted from '@/components/BookingSubmitted';
import { BookingProvider, useBooking } from '@/context/BookingContext';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

type Step = 'homepage' | 'privacystep' | 'phoneverifystep' | 'junkamountstep' | 'datetimestep' | 'bookingsubmitted';

function HomePageContent() {
  const { state, dispatch } = useBooking();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentStep = (searchParams.get('step') as Step | null) ?? 'homepage';

  // Извлекаем dispatcher_id из URL параметров
  useEffect(() => {
    const dispatcherId = searchParams.get('utm_content') || searchParams.get('dispatcher_id');
    if (dispatcherId) {
      dispatch({ type: 'SET_DISPATCHER_ID', payload: dispatcherId });
    }
  }, [searchParams, dispatch]);

  // Если условия позволяют пропустить текущий шаг — навигируем вперёд по URL

  // Проверяем статус верификации при изменении состояния
  useEffect(() => {
    if (state.isPhoneVerified && currentStep === 'phoneverifystep') {
      // Если телефон уже верифицирован, пропускаем шаг верификации
      router.push('/?step=junkamountstep', { scroll: false });
    }
  }, [state.isPhoneVerified, currentStep]);

  // Проверяем статус privacy policy при изменении состояния
  useEffect(() => {
    if (state.isPrivacyAccepted && currentStep === 'privacystep') {
      // Если privacy policy уже принята, пропускаем этот шаг
      if (state.isPhoneVerified) {
        router.push('/?step=junkamountstep', { scroll: false });
      } else {
        router.push('/?step=phoneverifystep', { scroll: false });
      }
    }
  }, [state.isPrivacyAccepted, state.isPhoneVerified, currentStep]);

  const navigateTo = (step: Step) => {
    if (step !== currentStep) {
      router.push(`/?step=${step}`, { scroll: false });
    }
  };

  const handleContinueFromHomepage = () => {
    if (state.isPrivacyAccepted) {
      // Если privacy policy уже принята, проверяем телефон
      if (state.isPhoneVerified) {
        navigateTo('junkamountstep');
      } else {
        navigateTo('phoneverifystep');
      }
    } else {
      navigateTo('privacystep');
    }
  };

  const handleContinueFromPrivacy = () => {
    if (state.isPhoneVerified) {
      // Если телефон уже верифицирован, пропускаем шаг верификации
      navigateTo('junkamountstep');
    } else {
      navigateTo('phoneverifystep');
    }
  };

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
                  controls={true}
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
                <BookingForm onContinue={handleContinueFromHomepage} />
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
            <PrivacyStep onContinue={handleContinueFromPrivacy} onBack={() => navigateTo('homepage')} />
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
              onContinue={() => navigateTo('junkamountstep')} 
              onBack={() => navigateTo('homepage')} 
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
            <JunkAmountStep onContinue={() => navigateTo('datetimestep')} onBack={() => navigateTo('homepage')} />
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
            <DateTimeStep onContinue={() => navigateTo('bookingsubmitted')} onBack={() => navigateTo('junkamountstep')} onHomepage={() => navigateTo('homepage')} />
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
    <div>
      <Header />
      {renderStep()}
      <Footer />
    </div>
  );
}

export default function HomePage() {
  return (
    <BookingProvider>
      <Suspense fallback={null}>
        <HomePageContent />
      </Suspense>
    </BookingProvider>
  );
}
