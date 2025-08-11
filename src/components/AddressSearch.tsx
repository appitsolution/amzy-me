import React, { useState, useEffect, useRef } from 'react';
import {
  TextField,
  Autocomplete,
  CircularProgress,
  Box,
  Typography,
  Alert
} from '@mui/material';
import { useApi } from '../hooks/useApi';
import { useBooking } from '../context/BookingContext';
import type { AddressSearchResult } from '../services/api';

interface AddressSearchProps {
  label?: string;
  placeholder?: string;
  error?: boolean;
  helperText?: string;
  required?: boolean;
}

export const AddressSearch: React.FC<AddressSearchProps> = ({
  label = 'Адрес',
  placeholder = 'Введите адрес...',
  error = false,
  helperText,
  required = false
}) => {
  const { state, dispatch } = useBooking();
  const { searchAddress, addressSearch } = useApi();
  const [inputValue, setInputValue] = useState<string>('');
  const [open, setOpen] = useState(false);
  const [isAddressSelected, setIsAddressSelected] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Обработка изменения ввода
  const handleInputChange = (value: string) => {
    // Не обновляем inputValue, если это пустая строка и у нас есть сохраненный адрес
    if (value === '' && state.address) {
      return;
    }
    
    setInputValue(value);
    
    // Если адрес был выбран из результатов, сбрасываем флаг
    if (isAddressSelected) {
      setIsAddressSelected(false);
    }
    
    // Очищаем предыдущий таймаут
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Устанавливаем новый таймаут для поиска только если адрес не был выбран
    timeoutRef.current = setTimeout(() => {
      if (value.trim().length >= 3 && !isAddressSelected) {
        searchAddress(value);
      } else if (!isAddressSelected) {
        dispatch({ type: 'SET_ADDRESS_SEARCH_RESULTS', payload: [] });
      }
    }, 300);
  };

  // Обработка выбора адреса
  const handleAddressSelect = (address: AddressSearchResult | null) => {
    if (address) {
      console.log('address', address);
      dispatch({ type: 'SET_ADDRESS', payload: address.house });
      dispatch({ type: 'SET_CITY', payload: address.city });
      dispatch({ type: 'SET_STATE', payload: address.state });
      dispatch({ type: 'SET_ZIP_CODE', payload: address.zipcode });
      setInputValue(address.address_str);
      setIsAddressSelected(true); // Отмечаем, что адрес выбран из результатов
    } else {
      // Если адрес очищен, сбрасываем все поля адреса
      dispatch({ type: 'SET_ADDRESS', payload: '' });
      dispatch({ type: 'SET_CITY', payload: '' });
      dispatch({ type: 'SET_STATE', payload: '' });
      dispatch({ type: 'SET_ZIP_CODE', payload: '' });
      setInputValue('');
      setIsAddressSelected(false);
    }
  };

  // Инициализация inputValue из состояния адреса
  useEffect(() => {
    console.log('AddressSearch: state.address =', state.address);
    console.log('AddressSearch: current inputValue =', inputValue);
    setInputValue(state.address || '');
  }, [state.address, inputValue]);

  // Очистка таймаута при размонтировании
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  console.log('AddressSearch render: inputValue =', inputValue);
  
  return (
    <Box>
      <Autocomplete
        key={`address-${state.address}`} // Принудительно пересоздаем компонент при изменении адреса
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        options={addressSearch.data?.data || []}
        getOptionLabel={(option) => option.address_str}
        inputValue={inputValue}
        onInputChange={(_, newInputValue) => handleInputChange(newInputValue)}
        onChange={(_, newValue) => handleAddressSelect(newValue)}
        loading={addressSearch.loading}
        sx={{
          '& .MuiInputBase-input::placeholder': {
            color: 'rgba(0, 0, 0, 0.87)',
            opacity: 1
          }
        }}
        filterOptions={(x) => x} // Отключаем встроенную фильтрацию
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            placeholder={placeholder}
            error={error || !!addressSearch.error}
            helperText={helperText || addressSearch.error}
            required={required}
            sx={{
              '& .MuiOutlinedInput-root': { 
                backgroundColor: '#fff' ,
                color: '#222'
              },
              '& .MuiInputBase-input::placeholder': {
                color: 'rgba(0, 0, 0, 0.87)',
                opacity: 1
              }
            }}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {addressSearch.loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
        renderOption={(props, option) => (
          <Box component="li" {...props}>
            <Box>
              <Typography variant="body2" component="div">
                {option.house}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {option.city}, {option.state} {option.zipcode}
              </Typography>
            </Box>
          </Box>
        )}
        noOptionsText={
          inputValue.length < 3 
            ? 'Enter at least 3 characters to search'
            : 'Address not found'
        }
      />
      
      {addressSearch.error && (
        <Alert severity="error" sx={{ mt: 1 }}>
          {addressSearch.error}
        </Alert>
      )}
    </Box>
  );
}; 