import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import { useApi } from '../hooks/useApi';
import { useBooking } from '../context/BookingContext';
import type { JobSize } from '../services/api';

export const JobSizeSelector: React.FC = () => {
  const { state, dispatch } = useBooking();
  const { getJobSizes, jobSizes } = useApi();

  // Загружаем список размеров работ при монтировании компонента
  useEffect(() => {
    if (!jobSizes.data) {
      getJobSizes();
    }
  }, [getJobSizes, jobSizes.data]);

  const handleJobSizeSelect = (jobSize: JobSize) => {
    dispatch({ type: 'SET_SELECTED_JOB_SIZE', payload: jobSize });
  };

  const isJobSizeSelected = (jobSize: JobSize) => {
    return state.selectedJobSize?.id === jobSize.id;
  };

  const formatPrice = (price: string) => {
    return `$${parseInt(price).toLocaleString()}`;
  };

  if (jobSizes.loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
        <CircularProgress />
      </Box>
    );
  }

  if (jobSizes.error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {jobSizes.error}
      </Alert>
    );
  }

  const jobSizesData = jobSizes.data?.data || [];

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Выберите объем работ
      </Typography>
      
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Выберите подходящий объем работ для вашего заказа
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {jobSizesData.map((jobSize) => (
          <Box key={jobSize.id} sx={{ flex: '1 1 300px', minWidth: 0 }}>
            <Card
              sx={{
                cursor: 'pointer',
                transition: 'all 0.2s',
                border: isJobSizeSelected(jobSize) ? 2 : 1,
                borderColor: isJobSizeSelected(jobSize) ? 'primary.main' : 'grey.300',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 3
                }
              }}
              onClick={() => handleJobSizeSelect(jobSize)}
            >
              <CardContent>
                <Typography variant="h6" component="div" gutterBottom>
                  {jobSize.name}
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h4" color="primary" fontWeight="bold">
                    {formatPrice(jobSize.price_estimate)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Примерная стоимость
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip
                    label={`От ${formatPrice(jobSize.price_min)}`}
                    size="small"
                    color="success"
                    variant="outlined"
                  />
                  <Chip
                    label={`До ${formatPrice(jobSize.price_max)}`}
                    size="small"
                    color="warning"
                    variant="outlined"
                  />
                </Box>
              </CardContent>

              <CardActions>
                <Button
                  fullWidth
                  variant={isJobSizeSelected(jobSize) ? 'contained' : 'outlined'}
                  color="primary"
                >
                  {isJobSizeSelected(jobSize) ? 'Выбрано' : 'Выбрать'}
                </Button>
              </CardActions>
            </Card>
          </Box>
        ))}
      </Box>

      {state.selectedJobSize && (
        <Box sx={{ mt: 2, p: 2, bgcolor: 'primary.light', borderRadius: 1 }}>
          <Typography variant="h6" color="white" gutterBottom>
            Выбранный объем: {state.selectedJobSize.name}
          </Typography>
          <Typography variant="body1" color="white">
            Примерная стоимость: {formatPrice(state.selectedJobSize.price_estimate)}
          </Typography>
          <Typography variant="body2" color="white" sx={{ opacity: 0.8 }}>
            Диапазон: {formatPrice(state.selectedJobSize.price_min)} - {formatPrice(state.selectedJobSize.price_max)}
          </Typography>
        </Box>
      )}

      {jobSizesData.length === 0 && !jobSizes.loading && (
        <Alert severity="info">
          Нет доступных размеров работ
        </Alert>
      )}
    </Box>
  );
}; 