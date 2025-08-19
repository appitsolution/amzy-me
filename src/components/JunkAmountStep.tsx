import React from "react";
import Image from 'next/image';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Slider from '@mui/material/Slider';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useBooking } from '../context/BookingContext';
import { useApi } from '../hooks/useApi';
import { PhotoUpload } from './PhotoUpload';

interface JunkAmountStepProps {
  onContinue: () => void;
  onBack: () => void;
}

// Маппинг для соответствия API данных с UI
import { jobSizeMapping as loadMapping } from '@/utils/jobSizeMapping';

export default function JunkAmountStep({ onContinue, onBack }: JunkAmountStepProps) {
  const { state, dispatch } = useBooking();
  const { getJobSizes, jobSizes } = useApi();
  const [selected, setSelected] = React.useState(() => {
    // Инициализируем с сохраненным значением из контекста, если оно есть
    return state.selectedJobSize?.id || '2';
  });
  const [price, setPrice] = React.useState([140, 270]);
  const [errors, setErrors] = React.useState({ notes: '', notes2: '' });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Загружаем данные о размерах работ при монтировании компонента
  React.useEffect(() => {
    if (!jobSizes.data) {
      getJobSizes();
    }
  }, [getJobSizes, jobSizes.data]);

  // Синхронизируем локальное состояние с контекстом при изменении selectedJobSize
  React.useEffect(() => {
    if (state.selectedJobSize?.id) {
      setSelected(state.selectedJobSize.id);
    }
  }, [state.selectedJobSize?.id]);

  // Также синхронизируем при загрузке данных о размерах работ
  React.useEffect(() => {
    if (jobSizes.data?.data && state.selectedJobSize?.id) {
      // Проверяем, что выбранный размер работы существует в загруженных данных
      const jobSizeExists = jobSizes.data.data.some(job => job.id === state.selectedJobSize?.id);
      if (jobSizeExists) {
        setSelected(state.selectedJobSize.id);
      }
    }
  }, [jobSizes.data, state.selectedJobSize?.id]);

  // Если пользователь не менял выбор и данные размеров загружены —
  // сохраняем дефолтный вариант (Pick Up, id: '2') в контекст
  React.useEffect(() => {
    if (jobSizes.data?.data && !state.selectedJobSize) {
      const defaultId = '2';
      const jobDefault = jobSizes.data.data.find(job => job.id === defaultId) || jobSizes.data.data[0];
      if (jobDefault) {
        setSelected(jobDefault.id);
        dispatch({ type: 'SET_SELECTED_JOB_SIZE', payload: jobDefault });
      }
    }
  }, [jobSizes.data, state.selectedJobSize, dispatch]);

  // Получаем данные о выбранном размере работы
  const selectedJobSize = jobSizes.data?.data?.find(job => job.id === selected);
  
  // Обновляем позиции ползунков (равные сегменты) при выборе размера работы
  React.useEffect(() => {
    if (selectedJobSize) {
      setPrice(computeSegmentRange(selectedJobSize.id));
    }
  }, [selectedJobSize]);

  // Также обновляем позиции при инициализации, если в контексте уже есть выбранный размер
  React.useEffect(() => {
    if (state.selectedJobSize && jobSizes.data?.data) {
      const jobSize = jobSizes.data.data.find(job => job.id === state.selectedJobSize?.id);
      if (jobSize) {
        setPrice(computeSegmentRange(jobSize.id));
      }
    }
  }, [state.selectedJobSize, jobSizes.data]);

  // Статичные min/max для ползунка (общий диапазон всех размеров работ)
  const staticMin = 95; // Минимальная цена из всех вариантов
  const staticMax = 1480; // Максимальная цена из всех вариантов
  const totalSegments = 5;
  const segmentWidth = (staticMax - staticMin) / totalSegments;

  const computeSegmentRange = (id: string | undefined) => {
    const parsed = parseInt(id || '1', 10);
    const clampedIndex = Math.min(Math.max(isNaN(parsed) ? 1 : parsed, 1), totalSegments);
    const start = Math.round(staticMin + (clampedIndex - 1) * segmentWidth);
    const end = Math.round(staticMin + clampedIndex * segmentWidth);
    return [start, end] as [number, number];
  };

  const segmentMarks = Array.from({ length: totalSegments + 1 }, (_, i) => ({
    value: Math.round(staticMin + i * segmentWidth)
  }));

  // Функция валидации
  const validateFields = () => {
    const newErrors = { notes: '', notes2: '' };
    let isValid = true;

    if (!state.notes.trim()) {
      newErrors.notes = 'Field is required.';
      isValid = false;
    }

    if (!state.notes2.trim()) {
      newErrors.notes2 = 'Field is required.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Обработчик нажатия кнопки Next
  const handleContinue = () => {
    if (validateFields()) {
      onContinue();
    }
  };

  // Очистка ошибок при изменении полей
  const handleNotesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'SET_NOTES', payload: e.target.value });
    if (errors.notes) {
      setErrors(prev => ({ ...prev, notes: '' }));
    }
  };

  const handleNotes2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'SET_NOTES2', payload: e.target.value });
    if (errors.notes2) {
      setErrors(prev => ({ ...prev, notes2: '' }));
    }
  };

  return (
    <Box sx={{ minHeight: isMobile ? '70vh' : '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', px: isMobile ? 2 : 0 }}>
      <Box sx={{ width: '100%', maxWidth: 900, textAlign: 'center', pt: isMobile ? 4 : 0 }}>
        <Typography variant="h2" color="#323232" sx={{ fontWeight: 600, fontSize: isMobile ? 28 : { xs: 32, md: 48 }, mb: isMobile ? 3 : 4, lineHeight: 1.1 }}>
          How much junk?
        </Typography>
        <Stack direction="row" justifyContent="center" alignItems="center" spacing={1} sx={{ mb: isMobile ? 3 : 4 }}>
          <Typography sx={{ color: '#bdbdbd', fontSize: isMobile ? 16 : 22, fontWeight: 600 }}>
            {state.firstName} {state.lastName} | {state.address}, {state.city}, {state.state} {state.zipCode}
          </Typography>
          <IconButton size="small" sx={{ color: '#bdbdbd' }} onClick={onBack}>
            <EditIcon />
          </IconButton>
        </Stack>
        <RadioGroup
          value={selected}
          onChange={e => {
            setSelected(e.target.value);
            // Сохраняем выбранный размер работы в контекст
            const jobSize = jobSizes.data?.data?.find(job => job.id === e.target.value);
            if (jobSize) {
              dispatch({ type: 'SET_SELECTED_JOB_SIZE', payload: jobSize });
            }
          }}
          sx={{ 
            justifyContent: 'center', 
            alignItems: 'center', 
            mb: isMobile ? 3 : 2,
            flexDirection:  'row'
          }}
        >
          {jobSizes.data?.data?.map((job, index) => {
            const loadInfo = loadMapping[job.id as keyof typeof loadMapping];
            if (!loadInfo) return null;
            
            return (
              <FormControlLabel
                key={job.id}
                value={job.id}
                control={<Radio sx={{ color: '#323232', '&.Mui-checked': { color: '#D94F04' } }} />}
                label={
                  <Stack alignItems="flex-start" spacing={0.5}>
                    <Image 
                      src={loadInfo.icon} 
                      alt={loadInfo.label} 
                      width={index === 0 ? (isMobile ? 24 : 30) : index === 4 ? (isMobile ? 60 : 80) : (isMobile ? 40 : 60)}
                      height={index === 0 ? (isMobile ? 24 : 30) : index === 4 ? (isMobile ? 40 : 50) : (isMobile ? 40 : 50)}
                      style={{ 
                        objectFit: 'contain'
                      }} 
                    />
                    <Typography sx={{ fontSize: isMobile ? 12 : 14 }} color="#323232">{loadInfo.label}</Typography>
                    <Typography sx={{ fontSize: isMobile ? 10 : 12 }} color="#666">${job.price_estimate}</Typography>
                  </Stack>
                }
                sx={{ 
                  mx: isMobile ? 0 : 2,
                  mb: isMobile ? 2 : 0
                }}
              />
            );
          })}
        </RadioGroup>
        <Box sx={{ width: isMobile ? '90%' : '80%', mx: 'auto', mb: isMobile ? 3 : 4 }}>
          <Slider
            value={price}
            min={staticMin}
            max={staticMax}
            step={10}
            disabled={true} // Заблокирован
            valueLabelDisplay="on"
            valueLabelFormat={(value, index) => {
              if (selectedJobSize) {
                return index === 0 ? `$${parseInt(selectedJobSize.price_min)}` : `$${parseInt(selectedJobSize.price_max)}`;
              }
              return `$${value}`;
            }}
            sx={{ 
              color: '#D94F04',
              '& .MuiSlider-thumb': {
                width: 4,
                height: 20,
                borderRadius: 0,
                backgroundColor: '#D94F04',
                border: 'none',
                '&:hover, &.Mui-focusVisible': {
                  boxShadow: 'none'
                }
              },
              '& .MuiSlider-track': {
                backgroundColor: '#D94F04',
                border: 'none'
              },
              '& .MuiSlider-rail': {
                backgroundColor: '#DEDEDE'
              },
              '& .MuiSlider-valueLabel': {
                color: '#D94F04',
                fontWeight: 600,
                fontSize: 15,
                backgroundColor: 'transparent',
                top: 'auto',
                bottom: '-60px'
              }
            }}
            marks={segmentMarks}
            disableSwap
          />
        </Box>
        <Box sx={{ textAlign: 'left', mb: isMobile ? 3 : 2 }}>
          <Typography sx={{ fontWeight: 600, fontSize: isMobile ? 14 : 16, mb: 1, color: '#323232' }}>Message to contractor</Typography>
          <Stack direction={isMobile ? 'column' : 'row'} spacing={isMobile ? 2 : 4}>
            <Stack spacing={2} sx={{ flex: isMobile ? 'none' : 2 }}>
              <TextField 
                fullWidth 
                value={state.notes}
                onChange={handleNotesChange}
                error={!!errors.notes}
                helperText={errors.notes}
                sx={{ 
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
                placeholder="Where is everything at? (Attic, basement or else?)" 
                variant="outlined" 
              />
              <TextField 
                fullWidth 
                value={state.notes2}
                onChange={handleNotes2Change}
                error={!!errors.notes2}
                helperText={errors.notes2}
                sx={{ 
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
                placeholder="What is the largest and heaviest item" 
                variant="outlined" 
              />
            </Stack>
            <Box sx={{ flex: isMobile ? 'none' : 1 }}>
              <PhotoUpload maxPhotos={8} maxFileSize={10} />
            </Box>
          </Stack>
        </Box>
        <Stack direction="row" spacing={isMobile ? 2 : 4} justifyContent="center" sx={{ mt: isMobile ? 3 : 4 }}>
          <Button 
            variant="outlined" 
            onClick={onBack}
            sx={{ 
              minWidth: isMobile ? 120 : 120, 
              width: isMobile ? 140 : 120,
              fontSize: isMobile ? 16 : 20, 
              borderRadius: '8px', 
              color: '#BDBDBD', 
              borderColor: '#E0E0E0',
              textTransform: 'none', 
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
              <path d="M7.69229 7.44217L1.44229 13.6922C1.38422 13.7502 1.31528 13.7963 1.23941 13.8277C1.16354 13.8592 1.08223 13.8753 1.0001 13.8753C0.917982 13.8753 0.836664 13.8592 0.760793 13.8277C0.684922 13.7963 0.615984 13.7502 0.557916 13.6922C0.499847 13.6341 0.453784 13.5652 0.422357 13.4893C0.390931 13.4134 0.374756 13.3321 0.374756 13.25C0.374756 13.1679 0.390931 13.0865 0.422357 13.0107C0.453784 12.9348 0.499847 12.8659 0.557916 12.8078L6.36651 6.99998L0.557916 1.19217C0.44064 1.07489 0.374756 0.915834 0.374756 0.749981C0.374756 0.584129 0.44064 0.425069 0.557916 0.307794C0.675191 0.190518 0.834251 0.124634 1.0001 0.124634C1.16596 0.124634 1.32502 0.190518 1.44229 0.307794L7.69229 6.55779C7.7504 6.61584 7.7965 6.68477 7.82795 6.76064C7.85941 6.83652 7.87559 6.91785 7.87559 6.99998C7.87559 7.08212 7.85941 7.16344 7.82795 7.23932C7.7965 7.31519 7.7504 7.38412 7.69229 7.44217Z" fill="#323232"/>
            </svg>
            Back
          </Button>
          <Button 
            variant="contained" 
            onClick={handleContinue}
            sx={{ 
              minWidth: isMobile ? 120 : 120, 
              width: isMobile ? 140 : 120,
              fontSize: isMobile ? 16 : 20, 
              borderRadius: '8px', 
              background: '#D94F04', 
              color: '#fff', 
              fontWeight: 500, 
              textTransform: 'none', 
              '&:hover': { background: '#b53e02' },
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: isMobile ? 2 : 2,
              py: isMobile ? 1.2 : 1
            }}
          >
            Next
            <svg xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: '8px' }} width="8" height="14" viewBox="0 0 8 14">
              <path d="M7.69229 7.44217L1.44229 13.6922C1.38422 13.7502 1.31528 13.7963 1.23941 13.8277C1.16354 13.8592 1.08223 13.8753 1.0001 13.8753C0.917982 13.8753 0.836664 13.8592 0.760793 13.8277C0.684922 13.7963 0.615984 13.7502 0.557916 13.6922C0.499847 13.6341 0.453784 13.5652 0.422357 13.4893C0.390931 13.4134 0.374756 13.3321 0.374756 13.25C0.374756 13.1679 0.390931 13.0865 0.422357 13.0107C0.453784 12.9348 0.499847 12.8659 0.557916 12.8078L6.36651 6.99998L0.557916 1.19217C0.44064 1.07489 0.374756 0.915834 0.374756 0.749981C0.374756 0.584129 0.44064 0.425069 0.557916 0.307794C0.675191 0.190518 0.834251 0.124634 1.0001 0.124634C1.16596 0.124634 1.32502 0.190518 1.44229 0.307794L7.69229 6.55779C7.7504 6.61584 7.7965 6.68477 7.82795 6.76064C7.85941 6.83652 7.87559 6.91785 7.87559 6.99998C7.87559 7.08212 7.85941 7.16344 7.82795 7.23932C7.7965 7.31519 7.7504 7.38412 7.69229 7.44217Z" fill={'white'}/>
            </svg>
          </Button>
        </Stack>
      </Box>
    </Box>
  );
} 