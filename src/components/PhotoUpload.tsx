import React, { useRef, useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Card,
  CardMedia,
  Alert
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useBooking } from '../context/BookingContext';
import { validateImageFile } from '../utils/validation';

interface PhotoUploadProps {
  maxPhotos?: number;
  maxFileSize?: number; // в MB
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({
  maxPhotos = 8,
  maxFileSize = 10
}) => {
  const { state, dispatch } = useBooking();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setError(null);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Проверяем количество фотографий
      if (state.photos.length >= maxPhotos) {
        setError(`Maximum number of photos: ${maxPhotos}`);
        break;
      }

      // Проверяем валидность файла
      if (!validateImageFile(file)) {
        setError(`File "${file.name}" is not a valid image or exceeds ${maxFileSize}MB size limit`);
        continue;
      }

      // Добавляем файл
      dispatch({ type: 'ADD_PHOTO', payload: file });
      // Переходим к новому фото
      setCurrentSlide(state.photos.length);
    }

    // Очищаем input для возможности повторной загрузки того же файла
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemovePhoto = (index: number) => {
    dispatch({ type: 'REMOVE_PHOTO', payload: index });
    // Обновляем текущий слайд если нужно
    if (currentSlide >= state.photos.length - 1) {
      setCurrentSlide(Math.max(0, state.photos.length - 2));
    }
  };

  const handleAddClick = () => {
    fileInputRef.current?.click();
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % (state.photos.length + 1));
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + state.photos.length + 1) % (state.photos.length + 1));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {isMobile ? (
        // Мобильная версия - горизонтальный ряд
        <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 1 }}>
          {state.photos.map((photo, index) => (
            <Box key={index} sx={{ flexShrink: 0 }}>
              <Card sx={{ 
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                overflow: 'hidden',
                width: 80,
                height: 80
              }}>
                <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                  <CardMedia
                    component="img"
                    sx={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover' 
                    }}
                    image={URL.createObjectURL(photo)}
                    alt={`Photo ${index + 1}`}
                  />
                  <IconButton
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 2,
                      right: 2,
                      backgroundColor: 'rgba(255,255,255,0.9)',
                      color: '#D94F04',
                      width: 20,
                      height: 20,
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,1)',
                      }
                    }}
                    onClick={() => handleRemovePhoto(index)}
                  >
                    <DeleteIcon sx={{ fontSize: 12 }} />
                  </IconButton>
                </Box>
              </Card>
            </Box>
          ))}

          {state.photos.length < maxPhotos && (
            <Box sx={{ flexShrink: 0 }}>
              <Card
                sx={{
                  width: 80,
                  height: 80,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px dashed',
                  borderColor: '#E0E0E0',
                  borderRadius: 2,
                  cursor: 'pointer',
                  backgroundColor: '#fff',
                  '&:hover': {
                    borderColor: '#D94F04',
                    backgroundColor: '#fff5f0'
                  }
                }}
                onClick={handleAddClick}
              >
                <AddIcon sx={{ 
                  fontSize: 24, 
                  color: '#BDBDBD'
                }} />
              </Card>
            </Box>
          )}
        </Box>
             ) : (
         // ПК версия - настоящий слайдер
         <Box sx={{ position: 'relative', width: '100%', maxWidth: 400, mx: 'auto' }}>
           {/* Основной слайд */}
           <Box sx={{ position: 'relative', borderRadius: 2, overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>
             {currentSlide < state.photos.length ? (
               // Показываем фото
               <Box sx={{ position: 'relative', width: '100%', height: 140 }}>
                 <CardMedia
                   component="img"
                   sx={{ 
                     width: '100%', 
                     height: '100%', 
                     objectFit: 'cover' 
                   }}
                   image={URL.createObjectURL(state.photos[currentSlide])}
                   alt={`Photo ${currentSlide + 1}`}
                 />
                 <IconButton
                   size="small"
                   sx={{
                     position: 'absolute',
                     top: 8,
                     right: 8,
                     backgroundColor: 'rgba(255,255,255,0.9)',
                     color: '#D94F04',
                     '&:hover': {
                       backgroundColor: 'rgba(255,255,255,1)',
                     }
                   }}
                   onClick={() => handleRemovePhoto(currentSlide)}
                 >
                   <DeleteIcon sx={{ fontSize: 18 }} />
                 </IconButton>
                 <Box sx={{ 
                   position: 'absolute', 
                   bottom: 0, 
                   left: 0, 
                   right: 0, 
                   backgroundColor: 'rgba(0,0,0,0.7)', 
                   color: 'white',
                   p: 1,
                   textAlign: 'center'
                 }}>
                   <Typography variant="caption" sx={{ fontSize: 12 }}>
                     {formatFileSize(state.photos[currentSlide].size)}
                   </Typography>
                 </Box>
               </Box>
             ) : (
               // Показываем кнопку добавления
               <Box sx={{ 
                 width: '100%', 
                 height: 140, 
                 display: 'flex', 
                 alignItems: 'center', 
                 justifyContent: 'center',
                 border: '2px dashed',
                 borderColor: '#E0E0E0',
                 backgroundColor: '#fff',
                 cursor: 'pointer',
                 '&:hover': {
                   borderColor: '#D94F04',
                   backgroundColor: '#fff5f0'
                 }
               }}
               onClick={handleAddClick}
               >
                 <Box textAlign="center">
                   {/* <AddIcon sx={{ 
                     fontSize: 60, 
                     color: '#BDBDBD',
                     mb: 2
                   }} /> */}
                   <Typography variant="body2" color="text.secondary" sx={{ 
                     fontSize: 16,
                     color: '#666'
                   }}>
                     Add Photo
                   </Typography>
                 </Box>
               </Box>
             )}
           </Box>

           {/* Всегда видимая кнопка добавления фото */}
           {state.photos.length < maxPhotos && (
             <IconButton
               onClick={handleAddClick}
               sx={{
                 position: 'absolute',
                 top: 8,
                 left: 8,
                 zIndex: 2,
                 backgroundColor: 'rgba(255,255,255,0.9)',
                 color: '#D94F04',
                 '&:hover': {
                   backgroundColor: 'rgba(255,255,255,1)',
                 }
               }}
               aria-label="Add photo"
             >
               <AddIcon />
             </IconButton>
           )}

           {/* Навигационные кнопки */}
           {(state.photos.length > 0 || state.photos.length < maxPhotos) && (
             <>
               <IconButton
                 onClick={handlePrevSlide}
                 sx={{
                   position: 'absolute',
                   left: -20,
                   top: '50%',
                   transform: 'translateY(-50%)',
                   backgroundColor: 'rgba(255,255,255,0.9)',
                   color: '#D94F04',
                   '&:hover': {
                     backgroundColor: 'rgba(255,255,255,1)',
                   }
                 }}
               >
                 <ChevronLeftIcon />
               </IconButton>
               <IconButton
                 onClick={handleNextSlide}
                 sx={{
                   position: 'absolute',
                   right: -20,
                   top: '50%',
                   transform: 'translateY(-50%)',
                   backgroundColor: 'rgba(255,255,255,0.9)',
                   color: '#D94F04',
                   '&:hover': {
                     backgroundColor: 'rgba(255,255,255,1)',
                   }
                 }}
               >
                 <ChevronRightIcon />
               </IconButton>
             </>
           )}

           {/* Индикаторы слайдов */}
           {(state.photos.length > 0 || state.photos.length < maxPhotos) && (
             <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 2 }}>
               {Array.from({ length: state.photos.length + (state.photos.length < maxPhotos ? 1 : 0) }).map((_, index) => (
                 <Box
                   key={index}
                   sx={{
                     width: 8,
                     height: 8,
                     borderRadius: '50%',
                     backgroundColor: index === currentSlide ? '#D94F04' : '#E0E0E0',
                     cursor: 'pointer',
                     '&:hover': {
                       backgroundColor: index === currentSlide ? '#b53e02' : '#ccc',
                     }
                   }}
                   onClick={() => setCurrentSlide(index)}
                 />
               ))}
             </Box>
           )}
         </Box>
       )}

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        capture={isMobile ? 'environment' : undefined}
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
    </Box>
  );
}; 