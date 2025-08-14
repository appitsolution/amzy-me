import React from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useBooking } from '../context/BookingContext';
import { formatPhoneNumber, cleanPhoneNumber } from '../utils/validation';
import { useApi } from '../hooks/useApi';

interface PhoneVerifyStepProps {
  onContinue: () => void;
  onBack: () => void;
}

export default function PhoneVerifyStep({ onContinue, onBack }: PhoneVerifyStepProps) {
  const { state, dispatch } = useBooking();
  const { checkPhoneVerification, sendPhoneAuthCode } = useApi();
  const [code, setCode] = React.useState(['', '', '', '']);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [codeSent, setCodeSent] = React.useState(false);
  const inputsRef = React.useRef<Array<HTMLInputElement | null>>([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Автоматически отправляем код при загрузке компонента
  React.useEffect(() => {
    const sendCode = async () => {
      if (!state.isPhoneVerified && state.phoneNumber && !codeSent) {
        setLoading(true);
        try {
          const cleanPhone = cleanPhoneNumber(state.phoneNumber);
          await sendPhoneAuthCode(cleanPhone);
          setCodeSent(true);
        } catch (error) {
          setError('Failed to send verification code. Please try again.');
        } finally {
          setLoading(false);
        }
      }
    };

    sendCode();
  }, [state.phoneNumber, state.isPhoneVerified, codeSent, sendPhoneAuthCode]);

  const handleChange = (idx: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newCode = [...code];
    newCode[idx] = value;
    setCode(newCode);
    if (value && idx < 3) {
      inputsRef.current[idx + 1]?.focus();
    }
    // Очищаем ошибку при вводе
    if (error) {
      setError('');
    }
  };

  // Автоматическая верификация при вводе всех 4 цифр
  React.useEffect(() => {
    const codeString = code.join('');
    if (codeString.length === 4 && !loading) {
      handleVerify();
    }
  }, [code, loading]);

  const handleVerify = async () => {
    const codeString = code.join('');
    if (codeString.length !== 4) {
      setError('Please enter a 4-digit code');
      return;
    }

    // Предотвращаем повторный вызов во время загрузки
    if (loading) {
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const cleanPhone = cleanPhoneNumber(state.phoneNumber);
      const result = await checkPhoneVerification(cleanPhone, codeString);
      
      if (result.status === 1) {
        // Успешная верификация - обновляем состояние
        dispatch({ type: 'SET_PHONE_VERIFIED', payload: true });
        onContinue();
      } else {
        setError(result.msg || 'Invalid code. Please try again.');
      }
    } catch {
      setError('Failed to verify code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    setError('');
    try {
      const cleanPhone = cleanPhoneNumber(state.phoneNumber);
      await sendPhoneAuthCode(cleanPhone);
      setCodeSent(true);
      setCode(['', '', '', '']); // Очищаем поле ввода
    } catch (error) {
      setError('Failed to resend code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', px: isMobile ? 2 : 0 }}>
      <Box sx={{ width: '100%', maxWidth: 600, textAlign: 'center', pt: isMobile ? 4 : 0 }}>
        <Typography variant="h2" sx={{ 
          fontWeight: 600, 
          color: '#323232', 
          fontSize: isMobile ? 28 : { xs: 32, md: 48 }, 
          mb: isMobile ? 2 : 2, 
          lineHeight: 1.1 
        }}>
          Verify phone number
        </Typography>
        <Typography sx={{ 
          color: '#444', 
          fontSize: isMobile ? 14 : 16, 
          mb: isMobile ? 1 : 1.5,
          lineHeight: 1.4
        }}>
          Enter verification text sent to you
        </Typography>
        <Typography sx={{ 
          color: '#323232', 
          fontSize: isMobile ? 16 : 16, 
          mb: isMobile ? 1 : 1.5,
          fontWeight: 600
        }}>
          {formatPhoneNumber(state.phoneNumber)}
        </Typography>
        <Link 
          onClick={onBack}
          sx={{ 
            color: '#C0BFBF', 
            textDecoration: 'none', 
            fontSize: isMobile ? 14 : 16, 
            mb: isMobile ? 3 : 3, 
            display: 'block', 
            fontWeight: 500,
            cursor: 'pointer',
            '&:hover': {
              color: '#999'
            }
          }}
        >
          Wrong Number?
        </Link>
        <Stack direction="row" spacing={isMobile ? 2 : 3} justifyContent="center" alignItems="center" sx={{ mb: isMobile ? 4 : 5, mt: isMobile ? 1 : 2 }}>
          {[0, 1, 2, 3].map((idx) => (
            <TextField
              key={idx}
              inputRef={el => inputsRef.current[idx] = el}
              value={code[idx]}
              onChange={e => handleChange(idx, e.target.value)}
              inputProps={{ 
                maxLength: 1,
                inputMode: "numeric",
                pattern: "[0-9]*",
                style: { 
                  textAlign: 'center', 
                  border: 'none', 
                  fontSize: isMobile ? 24 : 30, 
                  width: isMobile ? 18 : 24, 
                  height: isMobile ? 18 : 24, 
                  borderRadius: isMobile ? 8 : 12, 
                  background: '#fff' 
                } 
              }}
              sx={{ 
                '& .MuiOutlinedInput-root': { 
                  borderRadius: isMobile ? 1 : 2, 
                  background: '#fff',
                  width:  'auto',
                  height: 'auto'
                },
                '& .MuiInputBase-input:-webkit-autofill': {
                  '-webkit-box-shadow': '0 0 0 30px white inset !important',
                  '-webkit-text-fill-color': '#222 !important',
                  'transition': 'background-color 5000s ease-in-out 0s'
                },
                '& .MuiInputBase-input:-webkit-autofill:hover': {
                  '-webkit-box-shadow': '0 0 0 30px white inset !important',
                  '-webkit-text-fill-color': '#222 !important'
                },
                '& .MuiInputBase-input:-webkit-autofill:focus': {
                  '-webkit-box-shadow': '0 0 0 30px white inset !important',
                  '-webkit-text-fill-color': '#222 !important'
                },
                '& .MuiInputBase-input:-webkit-autofill:active': {
                  '-webkit-box-shadow': '0 0 0 30px white inset !important',
                  '-webkit-text-fill-color': '#222 !important'
                }
              }}
            />
          ))}
        </Stack>
        
        {error && (
          <Typography sx={{ 
            color: '#d32f2f', 
            fontSize: isMobile ? 14 : 16, 
            mb: isMobile ? 2 : 3,
            textAlign: 'center'
          }}>
            {error}
          </Typography>
        )}
        {loading && (
          <Typography sx={{ 
            color: '#666', 
            fontSize: isMobile ? 14 : 16, 
            mb: isMobile ? 2 : 3,
            textAlign: 'center'
          }}>
            {codeSent ? 'Verifying...' : 'Sending code...'}
          </Typography>
        )}
        
        {codeSent && !loading && (
          <Button 
            onClick={handleResendCode}
            sx={{ 
              color: '#D94F04', 
              textDecoration: 'none', 
              fontSize: isMobile ? 14 : 16, 
              mb: isMobile ? 2 : 3, 
              display: 'block', 
              fontWeight: 500,
              cursor: 'pointer',
              background: 'none',
              border: 'none',
              '&:hover': {
                color: '#b53e02',
                background: 'none'
              }
            }}
          >
            Resend Code
          </Button>
        )}
      </Box>
    </Box>
  );
} 