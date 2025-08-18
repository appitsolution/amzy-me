// Утилиты для работы с sessionStorage

const STORAGE_KEYS = {
  VERIFIED_PHONE: 'verifiedPhone',
  VERIFIED_PHONE_NUMBER: 'verifiedPhoneNumber',
  PRIVACY_ACCEPTED: 'privacyAccepted',
  ADDRESS_HOUSE: 'addressHouse',
  ADDRESS_CITY: 'addressCity',
  ADDRESS_STATE: 'addressState',
  ADDRESS_ZIP: 'addressZip',
} as const;

export const storageUtils = {
  // Сохранение статуса верификации телефона
  setPhoneVerified: (phoneNumber: string) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(STORAGE_KEYS.VERIFIED_PHONE, 'true');
      sessionStorage.setItem(STORAGE_KEYS.VERIFIED_PHONE_NUMBER, phoneNumber);
    }
  },

  // Получение статуса верификации телефона
  getPhoneVerified: (): { isVerified: boolean; phoneNumber: string | null } => {
    if (typeof window !== 'undefined') {
      const verifiedPhone = sessionStorage.getItem(STORAGE_KEYS.VERIFIED_PHONE);
      const verifiedPhoneNumber = sessionStorage.getItem(STORAGE_KEYS.VERIFIED_PHONE_NUMBER);
      
      return {
        isVerified: verifiedPhone === 'true',
        phoneNumber: verifiedPhoneNumber
      };
    }
    
    return {
      isVerified: false,
      phoneNumber: null
    };
  },

  // Очистка статуса верификации телефона
  clearPhoneVerified: () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(STORAGE_KEYS.VERIFIED_PHONE);
      sessionStorage.removeItem(STORAGE_KEYS.VERIFIED_PHONE_NUMBER);
    }
  },

  // Проверка, соответствует ли номер телефона верифицированному
  isPhoneNumberVerified: (phoneNumber: string): boolean => {
    const { isVerified, phoneNumber: verifiedPhone } = storageUtils.getPhoneVerified();
    if (!isVerified || !verifiedPhone) return false;
    
    // Сравниваем номера без форматирования
    const cleanCurrent = phoneNumber.replace(/\D/g, '');
    const cleanVerified = verifiedPhone.replace(/\D/g, '');
    
    return cleanCurrent === cleanVerified;
  },

  // Сохранение статуса принятия privacy policy
  setPrivacyAccepted: () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(STORAGE_KEYS.PRIVACY_ACCEPTED, 'true');
    }
  },

  // Получение статуса принятия privacy policy
  getPrivacyAccepted: (): boolean => {
    if (typeof window !== 'undefined') {
      const privacyAccepted = sessionStorage.getItem(STORAGE_KEYS.PRIVACY_ACCEPTED);
      return privacyAccepted === 'true';
    }
    return false;
  },

  // Очистка статуса принятия privacy policy
  clearPrivacyAccepted: () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(STORAGE_KEYS.PRIVACY_ACCEPTED);
    }
  },

  // Сохранение полей адреса
  setAddressFields: (house: string, city: string, state: string, zipcode: string) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(STORAGE_KEYS.ADDRESS_HOUSE, house || '');
      sessionStorage.setItem(STORAGE_KEYS.ADDRESS_CITY, city || '');
      sessionStorage.setItem(STORAGE_KEYS.ADDRESS_STATE, state || '');
      sessionStorage.setItem(STORAGE_KEYS.ADDRESS_ZIP, zipcode || '');
    }
  },

  // Получение полей адреса
  getAddressFields: (): { house: string; city: string; state: string; zipcode: string } => {
    if (typeof window !== 'undefined') {
      return {
        house: sessionStorage.getItem(STORAGE_KEYS.ADDRESS_HOUSE) || '',
        city: sessionStorage.getItem(STORAGE_KEYS.ADDRESS_CITY) || '',
        state: sessionStorage.getItem(STORAGE_KEYS.ADDRESS_STATE) || '',
        zipcode: sessionStorage.getItem(STORAGE_KEYS.ADDRESS_ZIP) || ''
      };
    }
    return { house: '', city: '', state: '', zipcode: '' };
  },

  // Очистка полей адреса
  clearAddressFields: () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(STORAGE_KEYS.ADDRESS_HOUSE);
      sessionStorage.removeItem(STORAGE_KEYS.ADDRESS_CITY);
      sessionStorage.removeItem(STORAGE_KEYS.ADDRESS_STATE);
      sessionStorage.removeItem(STORAGE_KEYS.ADDRESS_ZIP);
    }
  }
};
