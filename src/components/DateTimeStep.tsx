'use client';

import React from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useBooking } from '../context/BookingContext';
import { useApi } from '../hooks/useApi';
import { apiService } from '../services/api';
import { getTimezoneOffsetHours } from '../utils/dateUtils';
import { jobSizeMapping } from '@/utils/jobSizeMapping';
import { normalizeUsPhoneNumber } from '../utils/validation';

interface DateTimeStepProps {
  onContinue: () => void;
  onBack: () => void;
  onHomepage: () => void;
}

const times = [
  { label: '1 AM', status: 'disabled' },
  { label: '2 AM', status: 'disabled' },
  { label: '3 AM', status: 'busy' },
  { label: '4 AM', status: 'busy' },
  { label: '5 AM', status: 'busy' },
  { label: '6 AM', status: 'busy' },
  { label: '7 AM', status: 'medium' },
  { label: '8 AM', status: 'medium' },
  { label: '9 AM', status: 'medium' },
  { label: '10 AM', status: 'free' },
  { label: '11 AM', status: 'free' },
  { label: '12 AM', status: 'free' },
  { label: '1 PM', status: 'medium' },
  { label: '2 PM', status: 'medium' },
  { label: '3 PM', status: 'free' },
  { label: '4 PM', status: 'free' },
  { label: '5 PM', status: 'medium' },
  { label: '6 PM', status: 'medium' },
  { label: '7 PM', status: 'busy' },
  { label: '8 PM', status: 'busy' },
  { label: '9 PM', status: 'busy' },
  { label: '10 PM', status: 'busy' },
  { label: '11 PM', status: 'disabled' },
  { label: '12 PM', status: 'disabled' },
];

const statusColor = {
  free: '#7CB518',
  medium: '#FFD600',
  busy: '#D94F04',
  disabled: '#E0E0E0',
};

// Собственный календарь для мобильной версии
const MobileCalendar = ({ date, onDateChange }: { date: Dayjs | null, onDateChange: (date: Dayjs) => void }) => {
  const [currentWeek, setCurrentWeek] = React.useState(dayjs().startOf('week'));
  const today = dayjs();
  
  // Получаем дни текущей недели
  const weekDays = [];
  for (let i = 0; i < 7; i++) {
    weekDays.push(currentWeek.add(i, 'day'));
  }


  const isSelected = (day: Dayjs) => date && day.isSame(date, 'day');
  const isPast = (day: Dayjs) => day.isBefore(today, 'day');

  return (
    <Box sx={{ width: '100%', bgcolor: '#fff', borderRadius: 3, p: 2 }}>
            {/* Заголовок календаря */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <IconButton 
          onClick={() => setCurrentWeek(currentWeek.subtract(1, 'week'))}
          sx={{ color: '#323232' }}
        >
          <svg width="8" height="14" viewBox="0 0 8 14" fill="none" style={{ transform: 'rotate(180deg)' }}>
            <path d="M7.69229 7.44217L1.44229 13.6922C1.38422 13.7502 1.31528 13.7963 1.23941 13.8277C1.16354 13.8592 1.08223 13.8753 1.0001 13.8753C0.917982 13.8753 0.836664 13.8592 0.760793 13.8277C0.684922 13.7963 0.615984 13.7502 0.557916 13.6922C0.499847 13.6341 0.453784 13.5652 0.422357 13.4893C0.390931 13.4134 0.374756 13.3321 0.374756 13.25C0.374756 13.1679 0.390931 13.0865 0.422357 13.0107C0.453784 12.9348 0.499847 12.8659 0.557916 12.8078L6.36651 6.99998L0.557916 1.19217C0.44064 1.07489 0.374756 0.915834 0.374756 0.749981C0.374756 0.584129 0.44064 0.425069 0.557916 0.307794C0.675191 0.190518 0.834251 0.124634 1.0001 0.124634C1.16596 0.124634 1.32502 0.190518 1.44229 0.307794L7.69229 6.55779C7.7504 6.61584 7.7965 6.68477 7.82795 6.76064C7.85941 6.83652 7.87559 6.91785 7.87559 6.99998C7.87559 7.08212 7.85941 7.16344 7.82795 7.23932C7.7965 7.31519 7.7504 7.38412 7.69229 7.44217Z" fill="currentColor"/>
          </svg>
        </IconButton>
        <IconButton 
          onClick={() => setCurrentWeek(currentWeek.add(1, 'week'))}
          sx={{ color: '#323232' }}
        >
          <svg width="8" height="14" viewBox="0 0 8 14" fill="none" >
            <path d="M7.69229 7.44217L1.44229 13.6922C1.38422 13.7502 1.31528 13.7963 1.23941 13.8277C1.16354 13.8592 1.08223 13.8753 1.0001 13.8753C0.917982 13.8753 0.836664 13.8592 0.760793 13.8277C0.684922 13.7963 0.615984 13.7502 0.557916 13.6922C0.499847 13.6341 0.453784 13.5652 0.422357 13.4893C0.390931 13.4134 0.374756 13.3321 0.374756 13.25C0.374756 13.1679 0.390931 13.0865 0.422357 13.0107C0.453784 12.9348 0.499847 12.8659 0.557916 12.8078L6.36651 6.99998L0.557916 1.19217C0.44064 1.07489 0.374756 0.915834 0.374756 0.749981C0.374756 0.584129 0.44064 0.425069 0.557916 0.307794C0.675191 0.190518 0.834251 0.124634 1.0001 0.124634C1.16596 0.124634 1.32502 0.190518 1.44229 0.307794L7.69229 6.55779C7.7504 6.61584 7.7965 6.68477 7.82795 6.76064C7.85941 6.83652 7.87559 6.91785 7.87559 6.99998C7.87559 7.08212 7.85941 7.16344 7.82795 7.23932C7.7965 7.31519 7.7504 7.38412 7.69229 7.44217Z" fill="currentColor"/>
          </svg>
        </IconButton>
        <Typography sx={{ color: '#323232', fontWeight: 500, fontSize: 16 }}>
          {currentWeek.format('MMMM YYYY').toUpperCase()}
        </Typography>
        <Button
          onClick={() => {
            const today = dayjs();
            setCurrentWeek(today.startOf('week'));
            onDateChange(today);
          }}
          sx={{
            color: '#D94F04',
            fontSize: 12,
            fontWeight: 500,
            textTransform: 'none',
            minWidth: 'auto',
            px: 1,
            py: 0.5,
            '&:hover': {
              bgcolor: 'transparent',
              color: '#b53e02',
            },
          }}
        >
          Today
        </Button>
        
      </Stack>

      {/* Дни недели */}
      <Stack direction="row" sx={{ mb: 1 }}>
        {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day) => (
          <Box key={day} sx={{ flex: 1, textAlign: 'center' }}>
            <Typography sx={{ fontSize: 12, color: '#888', fontWeight: 500 }}>
              {day}
            </Typography>
          </Box>
        ))}
      </Stack>

      {/* Сетка дат - только одна неделя */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1 }}>
        {weekDays.map((day, index) => (
          <Box key={index} sx={{ aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Button
              onClick={() => !isPast(day) && onDateChange(day)}
              disabled={isPast(day)}
              sx={{
                minWidth: 'auto',
                width: '100%',
                height: '100%',
                borderRadius: '8px',
                fontSize: 14,
                fontWeight: 500,
                color: isSelected(day) ? '#fff' : isPast(day) ? '#E0E0E0' : '#323232',
                bgcolor: isSelected(day) ? '#D94F04' : 'transparent',
                '&:hover': {
                  bgcolor: isSelected(day) ? '#b53e02' : !isPast(day) ? '#f5f5f5' : 'transparent',
                },
                '&.Mui-disabled': {
                  color: '#E0E0E0',
                },
              }}
            >
              {day.date()}
            </Button>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default function DateTimeStep({ onContinue, onBack, onHomepage }: DateTimeStepProps) {
  const { state } = useBooking();
  const { addAppointment, getContractorAvailability, contractorAvailability } = useApi();
  const [date, setDate] = React.useState<Dayjs | null>(dayjs());
  const [selectedTime, setSelectedTime] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [availabilityData, setAvailabilityData] = React.useState<Array<{hour: number, percentage: number}>>([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Функция для загрузки данных о доступности
  const loadAvailability = React.useCallback(async (selectedDate: Dayjs) => {
    if (!state.selectedJobSize || !state.zipCode) return;

    try {
      const request = {
        zipcode: state.zipCode,
        job_size_id: state.selectedJobSize.id,
        date: Math.floor(selectedDate.valueOf() / 1000), // Конвертируем в секунды
        timezone_offset: getTimezoneOffsetHours(),
      };

      const response = await getContractorAvailability(request);
      if (response.data) {
        setAvailabilityData(response.data);
      }
    } catch (error) {
      console.error('Failed to load availability:', error);
      // В случае ошибки используем статичные данные
      setAvailabilityData([]);
    }
  }, [state.selectedJobSize?.id, state.zipCode]);

  // Загружаем данные при изменении даты или зависимостей
  React.useEffect(() => {
    if (date && state.selectedJobSize && state.zipCode) {
      loadAvailability(date);
    }
  }, [date, state.selectedJobSize, state.zipCode, loadAvailability]);

  // Функция для преобразования данных API в формат для отображения
  const getTimeSlots = () => {
    if (availabilityData.length === 0) {
      return times; // Возвращаем статичные данные если API не загрузился
    }

    return availabilityData.map((slot) => {
      const hour = slot.hour;
      const percentage = slot.percentage;
      
      // Определяем статус на основе процента доступности
      let status = 'disabled';
      if (percentage > 70) status = 'free';
      else if (percentage > 30) status = 'medium';
      else if (percentage > 0) status = 'busy';
      
      // Форматируем время
      const timeLabel = hour === 0 ? '12 AM' : 
                       hour === 12 ? '12 PM' : 
                       hour < 12 ? `${hour} AM` : `${hour - 12} PM`;
      
      return {
        label: timeLabel,
        status: status,
        percentage: percentage
      };
    });
  };

  const handleFinish = async () => {
    if (!date || !selectedTime || !state.selectedJobSize) {
      return;
    }

    setLoading(true);
    try {
      // Объединяем оба поля заметок
      const combinedNotes = `${state.notes}${state.notes ? '\n' : ''}${state.notes2}`.trim();
      
      // Конвертируем время в час (0-23)
      const timeHour = parseInt(selectedTime.split(' ')[0]);
      const isPM = selectedTime.includes('PM');
      const hour24 = isPM && timeHour !== 12 ? timeHour + 12 : timeHour === 12 && !isPM ? 0 : timeHour;
      
      // Находим соответствующий слот из API данных (используется для валидации)
      availabilityData.find(slot => {
        const slotHour = slot.hour;
        const slotTimeLabel = slotHour === 0 ? '12 AM' : 
                             slotHour === 12 ? '12 PM' : 
                             slotHour < 12 ? `${slotHour} AM` : `${slotHour - 12} PM`;
        return slotTimeLabel === selectedTime;
      });
      
      // Создаем timestamp для выбранной даты и времени
      const selectedDateTime = date.hour(hour24).minute(0).second(0).millisecond(0);
      const timestamp = Math.floor(selectedDateTime.valueOf() / 1000); // Конвертируем в секунды

      const request = {
        phone_number: normalizeUsPhoneNumber(state.phoneNumber),
        firstname: state.firstName,
        lastname: state.lastName,
        house: state.address,
        city: state.city,
        state: state.state,
        zipcode: state.zipCode,
        job_size_id: state.selectedJobSize.id,
        notes: combinedNotes,
        photos: state.photos,
        start_date: timestamp,
        timezone_offset: getTimezoneOffsetHours(),
      };

      await apiService.addAppointment(request);
      onContinue();
    } catch (error) {
      console.error('Failed to submit appointment:', error);
      // Здесь можно добавить обработку ошибок
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: isMobile ? '100vh' : '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', px: isMobile ? 2 : 0 }}>
      <Box sx={{ width: '100%', maxWidth: 1000, textAlign: 'center', pt: isMobile ? 4 : 0 }}>
        <Typography variant="h2" color="#323232" sx={{ fontWeight: 500, fontSize: isMobile ? 28 : { xs: 32, md: 48 }, mb: isMobile ? 2 : 2, lineHeight: 1.1 }}>
          Request date and time
        </Typography>
        <Stack direction={isMobile ? 'column' : 'row'} justifyContent="center" alignItems="center" spacing={isMobile ? 1 : 2} sx={{ mb: isMobile ? 3 : 4 }}>
          <Stack direction="row" spacing={1} alignItems="center">
          <Typography sx={{ color: '#bdbdbd', fontSize: isMobile ? 16 : 22, fontWeight: 500 }}>
            {state.firstName} {state.lastName} | {state.address}, {state.city}, {state.state} {state.zipCode}
          </Typography>
          <IconButton size="small" sx={{ color: '#bdbdbd' }} onClick={onHomepage}>
            <EditIcon />
          </IconButton>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
          <Typography sx={{ color: '#bdbdbd', fontSize: isMobile ? 16 : 22, fontWeight: 500 }}>
            {state.selectedJobSize ? (jobSizeMapping[state.selectedJobSize.id]?.label || state.selectedJobSize.name) : 'Select job size'}
          </Typography>
          <IconButton size="small" sx={{ color: '#bdbdbd' }} onClick={onBack}>
            <EditIcon />
          </IconButton>
          </Stack>
        </Stack>
        <Stack direction={isMobile ? 'column' : 'row'} spacing={isMobile ? 4 : 6} justifyContent="center" alignItems="flex-start" sx={{ mb: isMobile ? 3 : 4 }}>
          <Box sx={{ width: isMobile ? '100%' : 'auto' }}>
            {isMobile ? (
              <MobileCalendar date={date} onDateChange={setDate} />
            ) : (
              <Box sx={{ bgcolor: '#fff', borderRadius: 3, boxShadow: '0 4px 24px rgba(0,0,0,0.04)', p: 3 }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateCalendar
                    value={date}
                    onChange={setDate}
                    sx={{ 
                      minWidth: 340,
                      '& .MuiPickersDay-root.Mui-selected': {
                        backgroundColor: '#D94F04',
                        color: '#fff',
                        '&:hover': {
                          backgroundColor: '#b53e02',
                        },
                      },
                      '& .MuiPickersDay-root.Mui-disabled': {
                        color: '#E0E0E0',
                      },
                      '& .MuiPickersDay-root:not(.Mui-disabled):not(.Mui-selected)': {
                        color: '#323232',
                        '&:hover': {
                          backgroundColor: '#f5f5f5',
                        },
                      },
                      '& .MuiPickersCalendarHeader-root': {
                        color: '#323232',
                      },
                      '& .MuiPickersCalendarHeader-label': {
                        color: '#323232',
                        fontWeight: 500,
                      },
                      '& .MuiPickersCalendarHeader-switchViewButton': {
                        display: 'none',
                      },
                    }}
                    disablePast
                  />
                </LocalizationProvider>
              </Box>
            )}
          </Box>
          <Box sx={{ minWidth: isMobile ? '100%' : 340, textAlign: 'left' }}>
            <Typography sx={{ fontWeight: 600, fontSize: isMobile ? 16 : 18, mb: isMobile ? 3 : 4, color: '#323232' }}>
              Select an appointment time
              {contractorAvailability.loading && (
                <Typography component="span" sx={{ fontSize: isMobile ? 12 : 14, color: '#666', ml: 1 }}>
                  (Loading...)
                </Typography>
              )}
            </Typography>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: isMobile ? 'repeat(4, 1fr)' : 'repeat(7, 1fr)', 
              gap: isMobile ? 1 : 1.5,
              width: '100%'
            }}>
              {getTimeSlots().map((t) => (
                <Button
                  key={t.label}
                  variant="contained"
                  disabled={t.status === 'disabled'}
                  onClick={() => t.status !== 'disabled' && setSelectedTime(t.label)}
                  sx={{
                    width: '100%',
                    height: 35,
                    bgcolor: t.status === 'free' ? statusColor.free : t.status === 'medium' ? statusColor.medium : t.status === 'busy' ? statusColor.busy : statusColor.disabled,
                    color: '#fff',
                    opacity: t.status === 'disabled' ? 0.5 : (selectedTime && selectedTime !== t.label ? 0.6 : 1),
                    fontWeight: 600,
                    fontSize: isMobile ? 12 : 14,
                    borderRadius: '8px',
                    boxShadow: 'none',
                    '&:hover': {
                      bgcolor: t.status === 'free' ? '#5a8c13' : t.status === 'medium' ? '#e6c200' : t.status === 'busy' ? '#b53e02' : statusColor.disabled,
                      opacity: 1,
                    },
                    border: 'none',
                    transition: 'opacity 0.2s ease-in-out',
                    textTransform: 'none',
                    padding: isMobile ? '8px 4px' : '12px 8px',
                  }}
                >
                  {t.label}
                </Button>
              ))}
            </Box>
            <Stack direction="row" spacing={isMobile ? 2 : 3} alignItems="center" sx={{ mt: isMobile ? 2 : 3 }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Box sx={{ width: 12, height: 12, bgcolor: statusColor.free, borderRadius: '50%' }} />
                <Typography sx={{ fontSize: isMobile ? 14 : 16, color: '#323232'}}>Free</Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={isMobile ? 1 : 2}>
                <Box sx={{ width: 12, height: 12, bgcolor: statusColor.medium, borderRadius: '50%' }} />
                <Typography sx={{ fontSize: isMobile ? 14 : 16, color: '#323232' }}>Medium</Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={isMobile ? 1 : 2}>
                <Box sx={{ width: 12, height: 12, bgcolor: statusColor.busy, borderRadius: '50%' }} />
                <Typography sx={{ fontSize: isMobile ? 14 : 16, color: '#323232'}}>Busy</Typography>
              </Stack>
            </Stack>
          </Box>
        </Stack>
        <Stack direction="row" spacing={isMobile ? 2 : 4} justifyContent="center" sx={{ mt: isMobile ? 2 : 2 }}>
          <Button 
            variant="outlined" 
            onClick={onBack}
            sx={{ 
              minWidth: isMobile ? 120 : 120, 
              width: isMobile ? 140 : 120,
              fontSize: isMobile ? 16 : 16, 
              borderRadius: '8px', 
              textTransform: 'none', 
              color: '#BDBDBD', 
              borderColor: '#E0E0E0', 
              background: '#F7F7F7', 
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: isMobile ? 2 : 2,
              py: isMobile ? 1.2 : 1
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" style={{ transform: 'rotate(180deg)', marginRight: '8px' }} width="8" height="14" viewBox="0 0 8 14" fill="gray">
              <path d="M7.69229 7.44217L1.44229 13.6922C1.38422 13.7502 1.31528 13.7963 1.23941 13.8277C1.16354 13.8592 1.08223 13.8753 1.0001 13.8753C0.917982 13.8753 0.836664 13.8592 0.760793 13.8277C0.684922 13.7963 0.615984 13.7502 0.557916 13.6922C0.499847 13.6341 0.453784 13.5652 0.422357 13.4893C0.390931 13.4134 0.374756 13.3321 0.374756 13.25C0.374756 13.1679 0.390931 13.0865 0.422357 13.0107C0.453784 12.9348 0.499847 12.8659 0.557916 12.8078L6.36651 6.99998L0.557916 1.19217C0.44064 1.07489 0.374756 0.915834 0.374756 0.749981C0.374756 0.584129 0.44064 0.425069 0.557916 0.307794C0.675191 0.190518 0.834251 0.124634 1.0001 0.124634C1.16596 0.124634 1.32502 0.190518 1.44229 0.307794L7.69229 6.55779C7.7504 6.61584 7.7965 6.68477 7.82795 6.76064C7.85941 6.83652 7.87559 6.91785 7.87559 6.99998C7.87559 7.08212 7.85941 7.16344 7.82795 7.23932C7.7965 7.31519 7.7504 7.38412 7.69229 7.44217Z" fill="gray"/>
            </svg>
            Back 
          </Button>
          <Button 
            variant="contained" 
            onClick={handleFinish}
            disabled={loading || !date || !selectedTime || !state.selectedJobSize}
            sx={{ 
              minWidth: isMobile ? 120 : 120, 
              width: isMobile ? 140 : 120,
              fontSize: isMobile ? 16 : 16, 
              borderRadius: '8px', 
              textTransform: 'none', 
              background: '#D94F04', 
              color: '#fff', 
              fontWeight: 500, 
              '&:hover': { background: '#b53e02' },
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: isMobile ? 2 : 2,
              py: isMobile ? 1.2 : 1
            }}
          >
            {loading ? 'Submitting...' : 'Finish'}
            {!loading && (
              <svg xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: '8px' }} width="8" height="14" viewBox="0 0 8 14">
                <path d="M7.69229 7.44217L1.44229 13.6922C1.38422 13.7502 1.31528 13.7963 1.23941 13.8277C1.16354 13.8592 1.08223 13.8753 1.0001 13.8753C0.917982 13.8753 0.836664 13.8592 0.760793 13.8277C0.684922 13.7963 0.615984 13.7502 0.557916 13.6922C0.499847 13.6341 0.453784 13.5652 0.422357 13.4893C0.390931 13.4134 0.374756 13.3321 0.374756 13.25C0.374756 13.1679 0.390931 13.0865 0.422357 13.0107C0.453784 12.9348 0.499847 12.8659 0.557916 12.8078L6.36651 6.99998L0.557916 1.19217C0.44064 1.07489 0.374756 0.915834 0.374756 0.749981C0.374756 0.584129 0.44064 0.425069 0.557916 0.307794C0.675191 0.190518 0.834251 0.124634 1.0001 0.124634C1.16596 0.124634 1.32502 0.190518 1.44229 0.307794L7.69229 6.55779C7.7504 6.61584 7.7965 6.68477 7.82795 6.76064C7.85941 6.83652 7.87559 6.91785 7.87559 6.99998C7.87559 7.08212 7.85941 7.16344 7.82795 7.23932C7.7965 7.31519 7.7504 7.38412 7.69229 7.44217Z" fill={'white'}/>
              </svg>
            )}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
} 