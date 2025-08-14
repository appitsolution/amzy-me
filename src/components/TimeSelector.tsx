import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Chip
} from '@mui/material';
import { useApi } from '../hooks/useApi';
import { useBooking } from '../context/BookingContext';
import { getTimezoneOffsetHours, createDateWithTime } from '../utils/dateUtils';
import type { ContractorAvailabilityRequest } from '../services/api';

interface TimeSelectorProps {
  selectedDate: Date;
}

export const TimeSelector: React.FC<TimeSelectorProps> = ({ selectedDate }) => {
  const { state, dispatch } = useBooking();
  const { getContractorAvailability, contractorAvailability } = useApi();
  const [loading, setLoading] = useState(false);

  // Загружаем доступность подрядчиков при изменении даты или размера работы
  useEffect(() => {
    if (selectedDate && state.selectedJobSize && state.zipCode) {
      loadAvailability();
    }
  }, [selectedDate, state.selectedJobSize, state.zipCode]);

  const loadAvailability = async () => {
    if (!state.selectedJobSize || !state.zipCode) return;

    setLoading(true);
    
    try {
      const request: ContractorAvailabilityRequest = {
        zipcode: state.zipCode,
        job_size_id: state.selectedJobSize.id,
        date: Math.floor(selectedDate.getTime() / 1000),
        timezone_offset: getTimezoneOffsetHours()
      };

      await getContractorAvailability(request);
    } catch (error) {
      console.error('Ошибка загрузки доступности:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTimeSelect = (hour: number) => {
    dispatch({ type: 'SET_SELECTED_TIME', payload: hour });
  };

  const getAvailabilityColor = (percentage: number) => {
    if (percentage >= 80) return 'success';
    if (percentage >= 50) return 'warning';
    if (percentage >= 20) return 'error';
    return 'default';
  };

  const getAvailabilityText = (percentage: number) => {
    if (percentage >= 80) return 'Отлично';
    if (percentage >= 50) return 'Хорошо';
    if (percentage >= 20) return 'Ограничено';
    return 'Недоступно';
  };

  const formatTime = (hour: number) => {
    const time = createDateWithTime(selectedDate, hour);
    return time.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isTimeSelected = (hour: number) => {
    return state.selectedTime === hour;
  };

  const isTimeAvailable = (percentage: number) => {
    return percentage > 0;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
        <CircularProgress />
      </Box>
    );
  }

  if (contractorAvailability.error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {contractorAvailability.error}
      </Alert>
    );
  }

  const availabilityData = contractorAvailability.data?.data || [];

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Выберите время
      </Typography>
      
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Доступность подрядчиков на {selectedDate.toLocaleDateString('ru-RU')}
      </Typography>

      {state.selectedTime !== null && (
        <Box sx={{ mb: 2 }}>
          <Chip
            label={`Выбрано: ${formatTime(state.selectedTime)}`}
            color="primary"
            onDelete={() => dispatch({ type: 'SET_SELECTED_TIME', payload: null })}
          />
        </Box>
      )}

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {availabilityData.map((hourData) => (
          <Box key={hourData.hour} sx={{ flex: '1 1 200px', minWidth: 0 }}>
            <Button
              variant={isTimeSelected(hourData.hour) ? 'contained' : 'outlined'}
              color={getAvailabilityColor(hourData.percentage) as 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning'}
              fullWidth
              disabled={!isTimeAvailable(hourData.percentage)}
              onClick={() => handleTimeSelect(hourData.hour)}
              sx={{
                minHeight: 60,
                flexDirection: 'column',
                gap: 0.5
              }}
            >
              <Typography variant="body2" fontWeight="bold">
                {formatTime(hourData.hour)}
              </Typography>
              <Typography variant="caption">
                {getAvailabilityText(hourData.percentage)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {hourData.percentage}%
              </Typography>
            </Button>
          </Box>
        ))}
      </Box>

      {availabilityData.length === 0 && !loading && (
        <Alert severity="info">
          Нет данных о доступности подрядчиков для выбранной даты
        </Alert>
      )}
    </Box>
  );
}; 