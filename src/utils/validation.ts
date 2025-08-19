// Валидация номера телефона
export const validatePhoneNumber = (phone: string): boolean => {
  // Удаляем все нецифровые символы
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Проверяем, что номер содержит от 10 до 15 цифр
  return cleanPhone.length >= 10 && cleanPhone.length <= 15;
};

// Форматирование номера телефона для отображения
export const formatPhoneNumber = (phone: string): string => {
  const cleanPhone = phone.replace(/\D/g, '');
  
  if (cleanPhone.length === 10) {
    return `(${cleanPhone.slice(0, 3)}) ${cleanPhone.slice(3, 6)}-${cleanPhone.slice(6)}`;
  } else if (cleanPhone.length === 11) {
    return `+${cleanPhone.slice(0, 1)} (${cleanPhone.slice(1, 4)}) ${cleanPhone.slice(4, 7)}-${cleanPhone.slice(7)}`;
  }
  
  return phone;
};

// Валидация кода верификации
export const validateVerificationCode = (code: string): boolean => {
  // Код должен содержать только цифры и быть длиной 4-6 символов
  return /^\d{4,6}$/.test(code);
};

// Валидация имени
export const validateName = (name: string): boolean => {
  // Имя должно содержать только буквы, пробелы и дефисы, длиной от 2 до 50 символов
  return /^[а-яёa-z\s-]{2,50}$/i.test(name.trim());
};

// Валидация адреса
export const validateAddress = (address: string): boolean => {
  // Адрес должен содержать минимум 5 символов
  return address.trim().length >= 5;
};

// Валидация ZIP кода
export const validateZipCode = (zipCode: string): boolean => {
  // ZIP код должен содержать 5 цифр
  return /^\d{5}$/.test(zipCode);
};

// Валидация города
export const validateCity = (city: string): boolean => {
  // Город должен содержать только буквы, пробелы и дефисы, длиной от 2 до 50 символов
  return /^[а-яёa-z\s-]{2,50}$/i.test(city.trim());
};

// Валидация штата
export const validateState = (state: string): boolean => {
  // Штат должен содержать только буквы, длиной от 2 до 50 символов
  return /^[а-яёa-z]{2,50}$/i.test(state.trim());
};

// Валидация файлов изображений
export const validateImageFile = (file: File): boolean => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 10 * 1024 * 1024; // 10MB
  
  return allowedTypes.includes(file.type) && file.size <= maxSize;
};

// Получение ошибки валидации для поля
export const getFieldError = (field: string, value: string): string | null => {
  switch (field) {
    case 'phone':
      return !validatePhoneNumber(value) ? 'Enter valid phone number' : null;
    case 'firstName':
    case 'lastName':
      return !validateName(value) ? 'Name must be between 2 and 50 characters' : null;
    case 'address':
      return !validateAddress(value) ? 'Enter valid address' : null;
    case 'city':
      return !validateCity(value) ? 'Enter valid city' : null;
    case 'state':
      return !validateState(value) ? 'Enter valid state' : null;
    case 'zipCode':
      return !validateZipCode(value) ? 'ZIP code must be 5 digits' : null;
    case 'verificationCode':
      return !validateVerificationCode(value) ? 'Code must be 4-6 digits' : null;
    default:
      return null;
  }
};

// Очистка номера телефона от форматирования
export const cleanPhoneNumber = (phone: string): string => {
  return phone.replace(/\D/g, '');
};

// Нормализация номера телефона для отправки в API (США):
// Если номер в формате +1XXXXXXXXXX (11 цифр и начинается с 1) — убираем ведущую 1
export const normalizeUsPhoneNumber = (phone: string): string => {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 11 && digits.startsWith('1')) {
    return digits.slice(1);
  }
  return digits;
};

// Проверка, является ли строка пустой или содержит только пробелы
export const isEmpty = (value: string): boolean => {
  return !value || value.trim().length === 0;
}; 