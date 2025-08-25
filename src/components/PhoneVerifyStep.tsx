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
import { formatPhoneNumber, normalizeUsPhoneNumber } from '../utils/validation';
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
          const cleanPhone = normalizeUsPhoneNumber(state.phoneNumber);
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
    const digitsOnly = value.replace(/\D/g, '');
    // Нет валидных символов
    if (digitsOnly.length === 0) {
      const cleared = [...code];
      cleared[idx] = '';
      setCode(cleared);
      if (error) setError('');
      return;
    }

    const newCode = [...code];
    let writeCount = 0;
    for (let i = 0; i < digitsOnly.length && idx + i < 4; i++) {
      if (/^[0-9]$/.test(digitsOnly[i])) {
        newCode[idx + i] = digitsOnly[i];
        writeCount++;
      }
    }
    setCode(newCode);

    // Передвигаем фокус на следующий незаполненный/последний измененный инпут
    const nextIndex = Math.min(3, idx + writeCount);
    inputsRef.current[nextIndex]?.focus();

    if (error) setError('');
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement | HTMLDivElement>) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      setCode(prev => {
        const newCode = [...prev];
        if (newCode[idx]) {
          newCode[idx] = '';
        } else if (idx > 0) {
          newCode[idx - 1] = '';
          inputsRef.current[idx - 1]?.focus();
        }
        if (error) {
          setError('');
        }
        return newCode;
      });
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>, startIdx: number) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const digits = pastedData.replace(/\D/g, '').slice(0, 4);

    if (digits.length === 0) return;

    const newCode = [...code];
    let j = 0;
    for (let i = startIdx; i < 4 && j < digits.length; i++) {
      newCode[i] = digits[j];
      j++;
    }
    setCode(newCode);

    // Фокус на следующий индекс или последний
    const nextIndex = Math.min(3, startIdx + digits.length);
    inputsRef.current[nextIndex]?.focus();

    if (error) setError('');
  };

  // Автоматическая верификация при вводе всех 4 цифр (только при изменении кода)
  React.useEffect(() => {
    const codeString = code.join('');
    if (codeString.length === 4 && !loading) {
      handleVerify();
    }
  }, [code]);

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
      const cleanPhone = normalizeUsPhoneNumber(state.phoneNumber);
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
      const cleanPhone = normalizeUsPhoneNumber(state.phoneNumber);
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
              onKeyDown={e => handleKeyDown(idx, e)}
              onPaste={(e) => handlePaste(e, idx)}
              name={`otp-digit-${idx}`}
              autoComplete="off"
              inputProps={{ 
                maxLength: 1,
                inputMode: "numeric",
                pattern: "[0-9]*",
                autoComplete: 'off',
                autoCorrect: 'off',
                autoCapitalize: 'off',
                spellCheck: false,
                style: { 
                  textAlign: 'center', 
                  border: 'none', 
                  fontSize: isMobile ? 24 : 30, 
                  width: isMobile ? 18 : 24, 
                  height: isMobile ? 18 : 24, 
                  borderRadius: 8, 
                  background: '#fff' 
                } 
              }}
              sx={{ 
                '& .MuiOutlinedInput-root': { 
                  borderRadius: '8px', 
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
  
        <Stack direction="row" spacing={isMobile ? 2 : 4} justifyContent="center" sx={{ mt: isMobile ? 2 : 2 }}>
          <Button 
            variant="contained" 
            onClick={handleVerify}
            disabled={loading || code.join('').length !== 4}
            sx={{ 
              minWidth: isMobile ? 120 : 120, 
              width: isMobile ? 140 : 120,
              fontSize: isMobile ? 18 : 20, 
              borderRadius: '8px', 
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
            {'Verify'}
            <svg xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: '8px' }} width="8" height="14" viewBox="0 0 8 14">
              <path d="M7.69229 7.44217L1.44229 13.6922C1.38422 13.7502 1.31528 13.7963 1.23941 13.8277C1.16354 13.8592 1.08223 13.8753 1.0001 13.8753C0.917982 13.8753 0.836664 13.8592 0.760793 13.8277C0.684922 13.7963 0.615984 13.7502 0.557916 13.6922C0.499847 13.6341 0.453784 13.5652 0.422357 13.4893C0.390931 13.4134 0.374756 13.3321 0.374756 13.25C0.374756 13.1679 0.390931 13.0865 0.422357 13.0107C0.453784 12.9348 0.499847 12.8659 0.557916 12.8078L6.36651 6.99998L0.557916 1.19217C0.44064 1.07489 0.374756 0.915834 0.374756 0.749981C0.374756 0.584129 0.44064 0.425069 0.557916 0.307794C0.675191 0.190518 0.834251 0.124634 1.0001 0.124634C1.16596 0.124634 1.32502 0.190518 1.44229 0.307794L7.69229 6.55779C7.7504 6.61584 7.7965 6.68477 7.82795 6.76064C7.85941 6.83652 7.87559 6.91785 7.87559 6.99998C7.87559 7.08212 7.85941 7.16344 7.82795 7.23932C7.7965 7.31519 7.7504 7.38412 7.69229 7.44217Z" fill={(loading || code.join('').length !== 4) ? 'gray' : 'white'}/>
            </svg>
          </Button>
        </Stack>
      </Box>
    </Box>
  );
} 