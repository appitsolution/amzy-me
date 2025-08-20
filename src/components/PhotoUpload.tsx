import React, { useRef, useState, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Card,
  CardMedia,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { 
  Add as AddIcon, 
  Delete as DeleteIcon, 
  ChevronLeft as ChevronLeftIcon, 
  ChevronRight as ChevronRightIcon,
  CameraAlt as CameraIcon,
  PhotoLibrary as GalleryIcon
} from '@mui/icons-material';
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
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);
  const [isSelectingFile, setIsSelectingFile] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) {
      setIsSelectingFile(false);
      return;
    }

    setError(null);

    // Проверяем общее количество файлов, которые можно добавить
    const availableSlots = maxPhotos - state.photos.length;
    if (availableSlots <= 0) {
      setError(`Maximum number of photos: ${maxPhotos}`);
      // Очищаем input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      if (cameraInputRef.current) {
        cameraInputRef.current.value = '';
      }
      return;
    }

    // Ограничиваем количество файлов для обработки
    const filesToProcess = Math.min(files.length, availableSlots);
    let addedCount = 0;

    for (let i = 0; i < filesToProcess; i++) {
      const file = files[i];

      // Проверяем валидность файла
      if (!validateImageFile(file)) {
        setError(`File "${file.name}" is not a valid image or exceeds ${maxFileSize}MB size limit`);
        continue;
      }

      // Добавляем файл
      dispatch({ type: 'ADD_PHOTO', payload: file });
      addedCount++;
    }

    // Показываем предупреждение, если не все файлы были добавлены
    if (files.length > availableSlots) {
      setError(`Only ${availableSlots} photos were added. Maximum limit is ${maxPhotos} photos.`);
    }

    // Переходим к последнему добавленному фото
    if (addedCount > 0) {
      setCurrentSlide(state.photos.length + addedCount - 1);
    }

    // Очищаем input для возможности повторной загрузки того же файла
    // Используем setTimeout для предотвращения проблем с браузером
    setTimeout(() => {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      if (cameraInputRef.current) {
        cameraInputRef.current.value = '';
      }
      setIsSelectingFile(false);
    }, 0);
  };

  const handleRemovePhoto = (index: number) => {
    dispatch({ type: 'REMOVE_PHOTO', payload: index });
    // Обновляем текущий слайд если нужно
    if (currentSlide >= state.photos.length - 1) {
      const newTotalSlides = (state.photos.length - 1) + ((state.photos.length - 1) < maxPhotos ? 1 : 0);
      setCurrentSlide(Math.max(0, newTotalSlides - 1));
    }
  };

  const handleAddClick = () => {
    // Проверяем, не достигнут ли лимит
    if (state.photos.length >= maxPhotos) {
      setError(`Maximum number of photos: ${maxPhotos}`);
      return;
    }

    if (isSelectingFile) return; // Предотвращаем повторные вызовы

    if (isMobile) {
      setShowPhotoOptions(true);
    } else {
      setIsSelectingFile(true);
      fileInputRef.current?.click();
    }
  };

  const handleCameraClick = () => {
    // Проверяем, не достигнут ли лимит
    if (state.photos.length >= maxPhotos) {
      setError(`Maximum number of photos: ${maxPhotos}`);
      setShowPhotoOptions(false);
      return;
    }
    
    if (isSelectingFile) return; // Предотвращаем повторные вызовы
    
    setIsSelectingFile(true);
    setShowPhotoOptions(false);
    // Добавляем небольшую задержку, чтобы диалог успел закрыться
    setTimeout(() => {
      cameraInputRef.current?.click();
    }, 100);
  };

  const handleGalleryClick = () => {
    // Проверяем, не достигнут ли лимит
    if (state.photos.length >= maxPhotos) {
      setError(`Maximum number of photos: ${maxPhotos}`);
      setShowPhotoOptions(false);
      return;
    }
    
    if (isSelectingFile) return; // Предотвращаем повторные вызовы
    
    setIsSelectingFile(true);
    setShowPhotoOptions(false);
    // Добавляем небольшую задержку, чтобы диалог успел закрыться
    setTimeout(() => {
      fileInputRef.current?.click();
    }, 100);
  };

  const handleNextSlide = () => {
    const totalSlides = state.photos.length + (state.photos.length < maxPhotos ? 1 : 0);
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const handlePrevSlide = () => {
    const totalSlides = state.photos.length + (state.photos.length < maxPhotos ? 1 : 0);
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  // Эффект для корректировки currentSlide при изменении количества фотографий
  useEffect(() => {
    const totalSlides = state.photos.length + (state.photos.length < maxPhotos ? 1 : 0);
    if (currentSlide >= totalSlides) {
      setCurrentSlide(Math.max(0, totalSlides - 1));
    }
  }, [state.photos.length, currentSlide, maxPhotos]);

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
        // Мобильная версия - сетка с фиксированной шириной контейнера
        <Box sx={{ 
          width: '100%', 
          maxWidth: '100%',
          overflow: 'hidden',
          px: 1
        }}>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(70px, 80px))',
            gap: 1,
            justifyContent: 'center',
            width: '100%',
            maxWidth: '100%'
          }}>
            {state.photos.map((photo, index) => (
              <Box key={index} sx={{ width: '100%', aspectRatio: '1' }}>
                <Card sx={{ 
                  borderRadius: 2,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  overflow: 'hidden',
                  width: '100%',
                  height: '100%'
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

            {state.photos.length < maxPhotos ? (
              <Box sx={{ width: '100%', aspectRatio: '1' }}>
                <Card
                  sx={{
                    width: '100%',
                    height: '100%',
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
              ) : null}
          </Box>
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
             ) : state.photos.length < maxPhotos ? (
               // Показываем кнопку добавления только если не достигнут лимит
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
             ) : (
               // Если достигнут лимит, показываем пустой слайд или возвращаемся к последнему фото
               <Box sx={{ 
                 width: '100%', 
                 height: 140, 
                 display: 'flex', 
                 alignItems: 'center', 
                 justifyContent: 'center',
                 backgroundColor: '#f5f5f5',
                 border: '1px solid #e0e0e0'
               }}>
                 <Typography variant="body2" color="text.secondary" sx={{ 
                   fontSize: 14,
                   color: '#999'
                 }}>
                   Maximum photos reached
                 </Typography>
               </Box>
             )}
           </Box>

           {/* Кнопка добавления фото - видна только если не достигнут лимит */}
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

      {/* Input для галереи (без capture) */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      {/* Input для камеры (с capture) */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      {/* Модальное окно для выбора опций на мобильных устройствах */}
      <Dialog 
        open={showPhotoOptions} 
        onClose={() => {
          setShowPhotoOptions(false);
          setIsSelectingFile(false);
        }}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
          <Typography variant="h6" sx={{ color: '#333' }}>
            Add Photo
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <List sx={{ p: 0 }}>
            <ListItem disablePadding>
              <ListItemButton onClick={handleCameraClick} sx={{ py: 2 }}>
                <ListItemIcon>
                  <CameraIcon sx={{ color: '#D94F04', fontSize: 28 }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Take Photo" 
                  secondary="Use camera"
                  primaryTypographyProps={{ sx: { fontSize: 16, fontWeight: 500 } }}
                  secondaryTypographyProps={{ sx: { fontSize: 14 } }}
                />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={handleGalleryClick} sx={{ py: 2 }}>
                <ListItemIcon>
                  <GalleryIcon sx={{ color: '#D94F04', fontSize: 28 }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Choose from Gallery" 
                  secondary="Select existing photo"
                  primaryTypographyProps={{ sx: { fontSize: 16, fontWeight: 500 } }}
                  secondaryTypographyProps={{ sx: { fontSize: 14 } }}
                />
              </ListItemButton>
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button 
            onClick={() => {
              setShowPhotoOptions(false);
              setIsSelectingFile(false);
            }}
            sx={{ 
              color: '#666',
              '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' }
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}; 