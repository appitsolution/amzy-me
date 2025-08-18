import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import type { AddressSearchResult, JobSize } from '../services/api';
import { storageUtils } from '../utils/storage';

// Типы для состояния
export interface BookingState {
  // Шаг 1: Контактная информация
  firstName: string;
  lastName: string;
  phoneNumber: string;
  
  // Шаг 1: Адрес
  address: string;
  city: string;
  state: string;
  zipCode: string;
  addressSearchResults: AddressSearchResult[];
  
  // Шаг 2: Верификация телефона
  verificationCode: string;
  isPhoneVerified: boolean;
  
  // Шаг 3: Приватность
  isPrivacyAccepted: boolean;
  
  // Шаг 4: Детали услуги
  selectedJobSize: JobSize | null;
  notes: string;
  notes2: string; // Второе поле для заметок
  photos: File[];
  
  // Шаг 5: Дата и время
  selectedDate: Date | null;
  selectedTime: number | null; // час (0-23)
  
  // Общее состояние
  currentStep: number;
  isSubmitted: boolean;
  appointmentId: number | null;
}

// Действия для изменения состояния
export type BookingAction =
  | { type: 'SET_FIRST_NAME'; payload: string }
  | { type: 'SET_LAST_NAME'; payload: string }
  | { type: 'SET_PHONE_NUMBER'; payload: string }
  | { type: 'SET_ADDRESS'; payload: string }
  | { type: 'SET_CITY'; payload: string }
  | { type: 'SET_STATE'; payload: string }
  | { type: 'SET_ZIP_CODE'; payload: string }
  | { type: 'SET_ADDRESS_SEARCH_RESULTS'; payload: AddressSearchResult[] }
  | { type: 'SET_VERIFICATION_CODE'; payload: string }
  | { type: 'SET_PHONE_VERIFIED'; payload: boolean }
  | { type: 'SET_PRIVACY_ACCEPTED'; payload: boolean }
  | { type: 'SET_SELECTED_JOB_SIZE'; payload: JobSize | null }
  | { type: 'SET_NOTES'; payload: string }
  | { type: 'SET_NOTES2'; payload: string }
  | { type: 'ADD_PHOTO'; payload: File }
  | { type: 'REMOVE_PHOTO'; payload: number }
  | { type: 'SET_SELECTED_DATE'; payload: Date | null }
  | { type: 'SET_SELECTED_TIME'; payload: number | null }
  | { type: 'SET_CURRENT_STEP'; payload: number }
  | { type: 'SET_SUBMITTED'; payload: boolean }
  | { type: 'SET_APPOINTMENT_ID'; payload: number }
  | { type: 'RESET_STATE' }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' };

// Начальное состояние
const getInitialState = (): BookingState => {
  // Проверяем sessionStorage для статуса верификации телефона
  const { isVerified, phoneNumber } = storageUtils.getPhoneVerified();
  
  // Проверяем sessionStorage для статуса принятия privacy policy
  const isPrivacyAccepted = storageUtils.getPrivacyAccepted();
  
  if (isVerified && phoneNumber) {
    const savedAddress = storageUtils.getAddressFields();
    return {
      firstName: '',
      lastName: '',
      phoneNumber: phoneNumber,
      address: savedAddress.house || '',
      city: savedAddress.city || '',
      state: savedAddress.state || '',
      zipCode: savedAddress.zipcode || '',
      addressSearchResults: [],
      verificationCode: '',
      isPhoneVerified: true, // Устанавливаем как верифицированный
      isPrivacyAccepted: isPrivacyAccepted, // Восстанавливаем статус privacy policy
      selectedJobSize: null,
      notes: '',
      notes2: '',
      photos: [],
      selectedDate: null,
      selectedTime: null,
      currentStep: 1,
      isSubmitted: false,
      appointmentId: null,
    };
  }
  
  const savedAddress = storageUtils.getAddressFields();
  return {
    firstName: '',
    lastName: '',
    phoneNumber: '',
    address: savedAddress.house || '',
    city: savedAddress.city || '',
    state: savedAddress.state || '',
    zipCode: savedAddress.zipcode || '',
    addressSearchResults: [],
    verificationCode: '',
    isPhoneVerified: false,
    isPrivacyAccepted: isPrivacyAccepted, // Восстанавливаем статус privacy policy
    selectedJobSize: null,
    notes: '',
    notes2: '',
    photos: [],
    selectedDate: null,
    selectedTime: null,
    currentStep: 1,
    isSubmitted: false,
    appointmentId: null,
  };
};

// Редьюсер для управления состоянием
function bookingReducer(state: BookingState, action: BookingAction): BookingState {
  switch (action.type) {
    case 'SET_FIRST_NAME':
      return { ...state, firstName: action.payload };
    case 'SET_LAST_NAME':
      return { ...state, lastName: action.payload };
    case 'SET_PHONE_NUMBER':
      return { ...state, phoneNumber: action.payload };
    case 'SET_ADDRESS': {
      const newState = { ...state, address: action.payload };
      storageUtils.setAddressFields(newState.address, newState.city, newState.state, newState.zipCode);
      return newState;
    }
    case 'SET_CITY': {
      const newState = { ...state, city: action.payload };
      storageUtils.setAddressFields(newState.address, newState.city, newState.state, newState.zipCode);
      return newState;
    }
    case 'SET_STATE': {
      const newState = { ...state, state: action.payload };
      storageUtils.setAddressFields(newState.address, newState.city, newState.state, newState.zipCode);
      return newState;
    }
    case 'SET_ZIP_CODE': {
      const newState = { ...state, zipCode: action.payload };
      storageUtils.setAddressFields(newState.address, newState.city, newState.state, newState.zipCode);
      return newState;
    }
    case 'SET_ADDRESS_SEARCH_RESULTS':
      return { ...state, addressSearchResults: action.payload };
    case 'SET_VERIFICATION_CODE':
      return { ...state, verificationCode: action.payload };
    case 'SET_PHONE_VERIFIED':
      // Сохраняем статус верификации в sessionStorage
      if (action.payload) {
        storageUtils.setPhoneVerified(state.phoneNumber);
      } else {
        storageUtils.clearPhoneVerified();
      }
      return { ...state, isPhoneVerified: action.payload };
    case 'SET_PRIVACY_ACCEPTED':
      // Сохраняем статус privacy policy в sessionStorage
      if (action.payload) {
        storageUtils.setPrivacyAccepted();
      } else {
        storageUtils.clearPrivacyAccepted();
      }
      return { ...state, isPrivacyAccepted: action.payload };
    case 'SET_SELECTED_JOB_SIZE':
      return { ...state, selectedJobSize: action.payload };
    case 'SET_NOTES':
      return { ...state, notes: action.payload };
    case 'SET_NOTES2':
      return { ...state, notes2: action.payload };
    case 'ADD_PHOTO':
      return { ...state, photos: [...state.photos, action.payload] };
    case 'REMOVE_PHOTO':
      return { 
        ...state, 
        photos: state.photos.filter((_, index) => index !== action.payload) 
      };
    case 'SET_SELECTED_DATE':
      return { ...state, selectedDate: action.payload };
    case 'SET_SELECTED_TIME':
      return { ...state, selectedTime: action.payload };
    case 'SET_CURRENT_STEP':
      return { ...state, currentStep: action.payload };
    case 'SET_SUBMITTED':
      return { ...state, isSubmitted: action.payload };
    case 'SET_APPOINTMENT_ID':
      return { ...state, appointmentId: action.payload };
    case 'RESET_STATE':
      // Очищаем sessionStorage при сбросе состояния
      storageUtils.clearPhoneVerified();
      storageUtils.clearPrivacyAccepted();
      storageUtils.clearAddressFields();
      return getInitialState();
    case 'NEXT_STEP':
      return { ...state, currentStep: Math.min(state.currentStep + 1, 5) };
    case 'PREV_STEP':
      return { ...state, currentStep: Math.max(state.currentStep - 1, 1) };
    default:
      return state;
  }
}

// Контекст
interface BookingContextType {
  state: BookingState;
  dispatch: React.Dispatch<BookingAction>;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

// Провайдер контекста
interface BookingProviderProps {
  children: ReactNode;
}

export const BookingProvider: React.FC<BookingProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(bookingReducer, getInitialState());

  return (
    <BookingContext.Provider value={{ state, dispatch }}>
      {children}
    </BookingContext.Provider>
  );
};

// Хук для использования контекста
export const useBooking = (): BookingContextType => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}; 