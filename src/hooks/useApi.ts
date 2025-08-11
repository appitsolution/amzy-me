import { useState, useCallback } from 'react';
import { apiService } from '../services/api';
import type {
  AddressSearchResponse,
  CheckAddressRequest,
  CheckAddressResponse,
  SendPhoneAuthResponse,
  CheckPhoneVerificationResponse,
  JobSizeResponse,
  ContractorAvailabilityRequest,
  ContractorAvailabilityResponse,
  AddAppointmentRequest,
  AddAppointmentResponse
} from '../services/api';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export const useApi = () => {
  const [addressSearch, setAddressSearch] = useState<ApiState<AddressSearchResponse>>({
    data: null,
    loading: false,
    error: null
  });

  const [addressCheck, setAddressCheck] = useState<ApiState<CheckAddressResponse>>({
    data: null,
    loading: false,
    error: null
  });

  const [phoneAuth, setPhoneAuth] = useState<ApiState<SendPhoneAuthResponse>>({
    data: null,
    loading: false,
    error: null
  });

  const [phoneVerification, setPhoneVerification] = useState<ApiState<CheckPhoneVerificationResponse>>({
    data: null,
    loading: false,
    error: null
  });

  const [jobSizes, setJobSizes] = useState<ApiState<JobSizeResponse>>({
    data: null,
    loading: false,
    error: null
  });

  const [contractorAvailability, setContractorAvailability] = useState<ApiState<ContractorAvailabilityResponse>>({
    data: null,
    loading: false,
    error: null
  });

  const [addAppointmentState, setAddAppointmentState] = useState<ApiState<AddAppointmentResponse>>({
    data: null,
    loading: false,
    error: null
  });

  // Поиск адреса
  const searchAddress = useCallback(async (searchString: string) => {
    if (!searchString.trim()) {
      setAddressSearch({ data: null, loading: false, error: null });
      return;
    }

    setAddressSearch(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await apiService.searchAddress(searchString);
      setAddressSearch({ data: response, loading: false, error: null });
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка поиска адреса';
      setAddressSearch({ data: null, loading: false, error: errorMessage });
      throw error;
    }
  }, []);

  // Проверка адреса
  const checkAddress = useCallback(async (address: CheckAddressRequest) => {
    setAddressCheck(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await apiService.checkAddress(address);
      setAddressCheck({ data: response, loading: false, error: null });
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка проверки адреса';
      setAddressCheck({ data: null, loading: false, error: errorMessage });
      throw error;
    }
  }, []);

  // Отправка SMS кода
  const sendPhoneAuthCode = useCallback(async (phoneNumber: string) => {
    setPhoneAuth(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await apiService.sendPhoneAuthCode(phoneNumber);
      setPhoneAuth({ data: response, loading: false, error: null });
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка отправки SMS';
      setPhoneAuth({ data: null, loading: false, error: errorMessage });
      throw error;
    }
  }, []);

  // Проверка кода верификации
  const checkPhoneVerification = useCallback(async (phoneNumber: string, code: string) => {
    setPhoneVerification(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await apiService.checkPhoneVerification(phoneNumber, code);
      setPhoneVerification({ data: response, loading: false, error: null });
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка проверки кода';
      setPhoneVerification({ data: null, loading: false, error: errorMessage });
      throw error;
    }
  }, []);

  // Получение списка объемов работ
  const getJobSizes = useCallback(async () => {
    setJobSizes(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await apiService.getJobSizes();
      setJobSizes({ data: response, loading: false, error: null });
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка получения списка работ';
      setJobSizes({ data: null, loading: false, error: errorMessage });
      throw error;
    }
  }, []);

  // Получение доступности подрядчиков
  const getContractorAvailability = useCallback(async (request: ContractorAvailabilityRequest) => {
    setContractorAvailability(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await apiService.getContractorAvailability(request);
      setContractorAvailability({ data: response, loading: false, error: null });
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка получения доступности';
      setContractorAvailability({ data: null, loading: false, error: errorMessage });
      throw error;
    }
  }, []);

  // Добавление записи
  const addAppointment = useCallback(async (request: AddAppointmentRequest) => {
    setAddAppointmentState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await apiService.addAppointment(request);
      setAddAppointmentState({ data: response, loading: false, error: null });
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка создания записи';
      setAddAppointmentState({ data: null, loading: false, error: errorMessage });
      throw error;
    }
  }, []);

  // Сброс состояний
  const resetStates = useCallback(() => {
    setAddressSearch({ data: null, loading: false, error: null });
    setAddressCheck({ data: null, loading: false, error: null });
    setPhoneAuth({ data: null, loading: false, error: null });
    setPhoneVerification({ data: null, loading: false, error: null });
    setJobSizes({ data: null, loading: false, error: null });
    setContractorAvailability({ data: null, loading: false, error: null });
    setAddAppointmentState({ data: null, loading: false, error: null });
  }, []);

  return {
    // Состояния
    addressSearch,
    addressCheck,
    phoneAuth,
    phoneVerification,
    jobSizes,
    contractorAvailability,
    addAppointment: addAppointmentState,
    
    // Функции
    searchAddress,
    checkAddress,
    sendPhoneAuthCode,
    checkPhoneVerification,
    getJobSizes,
    getContractorAvailability,
    resetStates
  };
}; 