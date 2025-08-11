// Получение смещения часового пояса в минутах
export const getTimezoneOffset = (): number => {
  return new Date().getTimezoneOffset();
};

// Получение смещения часового пояса в часах
export const getTimezoneOffsetHours = (): number => {
  return getTimezoneOffset() / -60;
};

// Конвертация даты в timestamp
export const dateToTimestamp = (date: Date): number => {
  return Math.floor(date.getTime() / 1000);
};

// Конвертация timestamp в дату
export const timestampToDate = (timestamp: number): Date => {
  return new Date(timestamp * 1000);
};

// Форматирование даты для отображения
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Форматирование времени для отображения
export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Получение текущего timestamp
export const getCurrentTimestamp = (): number => {
  return dateToTimestamp(new Date());
};

// Создание даты с определенным временем
export const createDateWithTime = (date: Date, hours: number, minutes: number = 0): Date => {
  const newDate = new Date(date);
  newDate.setHours(hours, minutes, 0, 0);
  return newDate;
};

// Проверка, является ли дата сегодняшней
export const isToday = (date: Date): boolean => {
  const today = new Date();
  return date.getDate() === today.getDate() &&
         date.getMonth() === today.getMonth() &&
         date.getFullYear() === today.getFullYear();
};

// Проверка, является ли дата вчерашней
export const isYesterday = (date: Date): boolean => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return date.getDate() === yesterday.getDate() &&
         date.getMonth() === yesterday.getMonth() &&
         date.getFullYear() === yesterday.getFullYear();
};

// Получение относительного времени
export const getRelativeTime = (date: Date): string => {
  if (isToday(date)) {
    return 'Сегодня';
  } else if (isYesterday(date)) {
    return 'Вчера';
  } else {
    return formatDate(date);
  }
}; 