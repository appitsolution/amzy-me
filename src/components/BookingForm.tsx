import React, { useState } from "react";
import Image from 'next/image';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { AddressSearch } from './AddressSearch';
import { useBooking } from '../context/BookingContext';
import { validateName, validatePhoneNumber, getFieldError, formatPhoneNumber } from '../utils/validation';
import { useApi } from '../hooks/useApi';
import { storageUtils } from '../utils/storage';

interface BookingFormProps {
  onContinue: () => void;
}

const BookingForm = ({ onContinue }: BookingFormProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { state, dispatch } = useBooking();
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Отладочная информация
  console.log('BookingForm: state.address =', state.address);
  const { checkAddress, addressCheck } = useApi();
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    // Валидация имени
    if (!state.firstName.trim()) {
      newErrors.firstName = 'Enter first name';
    } else if (!validateName(state.firstName)) {
      newErrors.firstName = getFieldError('firstName', state.firstName) || 'Invalid first name';
    }

    // Валидация фамилии
    if (!state.lastName.trim()) {
      newErrors.lastName = 'Enter last name';
    } else if (!validateName(state.lastName)) {
      newErrors.lastName = getFieldError('lastName', state.lastName) || 'Invalid last name';
    }

    // Валидация адреса
    if (!state.address.trim()) {
      newErrors.address = 'Enter address';
    }

    // Валидация телефона
    if (!state.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Enter phone number';
    } else if (!validatePhoneNumber(state.phoneNumber)) {
      newErrors.phoneNumber = getFieldError('phone', state.phoneNumber) || 'Invalid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = async () => {
    if (validateForm()) {
      setLoading(true);
      setErrors((prev) => ({ ...prev, address: '' }));
      try {
        const res = await checkAddress({
          house: state.address,
          city: state.city,
          state: state.state,
          zipcode: state.zipCode,
        });
        if (res.status === 1) {
          setLoading(false);
          onContinue();
        } else {
          setLoading(false);
          setErrors((prev) => ({ ...prev, address: res.msg || 'Invalid address' }));
        }
      } catch {
        setLoading(false);
        setErrors((prev) => ({ ...prev, address: addressCheck.error || 'Address check error' }));
      }
    }
  };

  return (
    <Box sx={{ 
      minWidth: isMobile ? '100%' : 455, 
      borderRadius: '8px', 
      p: isMobile ? 3 : 4 
    }}>
      <Typography 
        variant="h1" 
        sx={{ 
          fontSize: isMobile ? 32 : 48, 
          fontWeight: 500, 
          mb: isMobile ? 3 : 4, 
          color: '#222',
          textAlign: isMobile ? 'center' : 'left'
        }}
      >
        Request booking
      </Typography>
      <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 2 : 2.5 }} autoComplete="on">
        <Stack direction={isMobile ? 'column' : 'row'} spacing={isMobile ? 2 : 2}>
          <TextField 
            fullWidth 
            placeholder="First Name" 
            variant="outlined" 
            value={state.firstName}
            onChange={(e) => {
              dispatch({ type: 'SET_FIRST_NAME', payload: e.target.value });
              if (errors.firstName) {
                setErrors(prev => ({ ...prev, firstName: '' }));
              }
            }}
            error={!!errors.firstName}
            helperText={errors.firstName}
            inputProps={{
              autoComplete: 'given-name',
              name: 'firstName',
              type: 'text',
              'data-testid': 'first-name-input'
            }}
            sx={{ 
              fontSize: isMobile ? 16 : 18, 
              borderRadius: '8px', 
              '& .MuiOutlinedInput-root': { backgroundColor: '#fff', borderRadius: '8px' },
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
          <TextField 
            fullWidth 
            placeholder="Last Name" 
            variant="outlined" 
            value={state.lastName}
            onChange={(e) => {
              dispatch({ type: 'SET_LAST_NAME', payload: e.target.value });
              if (errors.lastName) {
                setErrors(prev => ({ ...prev, lastName: '' }));
              }
            }}
            error={!!errors.lastName}
            helperText={errors.lastName}
            inputProps={{
              autoComplete: 'family-name',
              name: 'lastName',
              type: 'text',
              'data-testid': 'last-name-input'
            }}
            sx={{ 
              fontSize: isMobile ? 16 : 18, 
              borderRadius: '8px', 
              '& .MuiOutlinedInput-root': { backgroundColor: '#fff', borderRadius: '8px' },
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
        </Stack>
        <AddressSearch 
          label="Address"
          placeholder="Enter address..."
          error={!!errors.address}
          helperText={errors.address}
          required
        />
        <Stack 
          direction={isMobile ? 'column' : 'row'} 
          spacing={isMobile ? 2 : 2} 
          alignItems={isMobile ? 'stretch' : 'center'}
        >
          <TextField
            fullWidth
            placeholder="(253)444-0343"
            variant="outlined"
            value={formatPhoneNumber(state.phoneNumber)}
            onChange={(e) => {
              const formattedPhone = formatPhoneNumber(e.target.value);
              
              // Если номер телефона изменился и он был верифицирован, сбрасываем статус верификации
              if (!storageUtils.isPhoneNumberVerified(formattedPhone) && state.isPhoneVerified) {
                dispatch({ type: 'SET_PHONE_VERIFIED', payload: false });
              }
              
              dispatch({ type: 'SET_PHONE_NUMBER', payload: formattedPhone });
              if (errors.phoneNumber) {
                setErrors(prev => ({ ...prev, phoneNumber: '' }));
              }
            }}
            error={!!errors.phoneNumber}
            helperText={errors.phoneNumber}
            inputProps={{
              autoComplete: 'tel',
              name: 'phoneNumber',
              type: 'tel',
              'data-testid': 'phone-input'
            }}
            sx={{ 
              fontSize: isMobile ? 16 : 18, 
              maxWidth: isMobile ? '100%' : 220, 
              '& .MuiOutlinedInput-root': { backgroundColor: '#fff', borderRadius: '8px' },
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
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Image src="/icons/phone.svg" alt="phone" width={24} height={24} style={{ opacity: 0.7 }} />
                </InputAdornment>
              ),
            }}
          />
          <Button 
            type="button" 
            variant="contained" 
            onClick={handleContinue}
            sx={{ 
              background: '#D94F04', 
              color: '#fff', 
              borderRadius: '8px', 
              px: isMobile ? 3 : 4, 
              py: isMobile ? 1.5 : 1.2,
              fontSize: isMobile ? 18 : 22, 
              fontWeight: 500, 
              textTransform: 'none', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: 1.5, 
              '&:hover': { background: '#b53e02' } 
            }}
            loading={loading}
          >
            {state.isPhoneVerified ? 'Continue' : 'Continue'}
            <Image src="/icons/continue.svg" alt="continue" width={22} height={22} style={{ marginLeft: 8, marginBottom: -2 }} />
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default BookingForm; 