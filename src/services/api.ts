const API_BASE_URL = 'https://amzy.me/testapp/api/web';

// Типы для API ответов
export interface AddressSearchResult {
  address_str: string;
  house: string;
  city: string;
  state: string;
  zipcode: string;
}

export interface AddressSearchResponse {
  status: number;
  msg: string;
  data: AddressSearchResult[];
}

export interface CheckAddressRequest {
  house: string;
  city: string;
  state: string;
  zipcode: string;
}

export interface CheckAddressResponse {
  status: number;
  msg: string;
  statuscode?: number;
}

export interface SendPhoneAuthRequest {
  phone_number: string;
}

export interface SendPhoneAuthResponse {
  status: number;
  msg: string;
  code_phone: string;
}

export interface CheckPhoneVerificationRequest {
  phone_number: string;
  code: string;
}

export interface CheckPhoneVerificationResponse {
  status: number;
  msg: string;
}

export interface JobSize {
  id: string;
  name: string;
  price_estimate: string;
  price_min: string;
  price_max: string;
}

export interface JobSizeResponse {
  status: number;
  msg: string;
  data: JobSize[];
}

export interface ContractorAvailabilityRequest {
  zipcode: string;
  job_size_id: string;
  date: number; // timestamp
  timezone_offset: number;
}

export interface HourAvailability {
  hour: number;
  percentage: number;
}

export interface ContractorAvailabilityResponse {
  status: number;
  msg: string;
  data: HourAvailability[];
}

export interface AddAppointmentRequest {
  phone_number: string;
  firstname: string;
  lastname: string;
  house: string;
  city: string;
  state: string;
  zipcode: string;
  job_size_id: string;
  notes: string;
  photos: File[];
  start_date: number; // timestamp
  timezone_offset: number;
  dispatcher_id?: string;
}

export interface AddAppointmentResponse {
  status: number;
  msg: string;
  data: {
    appointment_id: number;
  };
}

// Функция для выполнения API запросов
async function apiRequest<T>(
  endpoint: string,
  method: 'GET' | 'POST' = 'GET',
  data?: Record<string, string | number | boolean>
): Promise<T> {
  let url = `${API_BASE_URL}${endpoint}`;
  
  const options: RequestInit = {
    method,
  };

  if (data && method === 'POST') {
    // Используем FormData для всех POST запросов
    const formData = new FormData();
    
    // Добавляем все поля в FormData
    Object.keys(data).forEach(key => {
      formData.append(key, String(data[key]));
    });
    
    options.body = formData;
    // Не устанавливаем Content-Type для FormData, браузер сам установит с boundary
  } else if (data && method === 'GET') {
    const params = new URLSearchParams();
    Object.keys(data).forEach(key => {
      params.append(key, String(data[key]));
    });
    url += `?${params.toString()}`;
  }

  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// API функции
export const apiService = {
  // Поиск адреса
  searchAddress: async (searchString: string): Promise<AddressSearchResponse> => {
    return apiRequest<AddressSearchResponse>('/user/search_address', 'GET', {
      search_string: searchString
    });
  },

  // Проверка адреса
  checkAddress: async (address: CheckAddressRequest): Promise<CheckAddressResponse> => {
    return apiRequest<CheckAddressResponse>('/user/check_address', 'POST', address as unknown as Record<string, string | number | boolean>);
  },

  // Отправка SMS кода
  sendPhoneAuthCode: async (phoneNumber: string): Promise<SendPhoneAuthResponse> => {
    return apiRequest<SendPhoneAuthResponse>('/auth/send_phone_auth_code', 'POST', {
      phone_number: phoneNumber
    });
  },

  // Проверка кода верификации
  checkPhoneVerification: async (phoneNumber: string, code: string): Promise<CheckPhoneVerificationResponse> => {
    return apiRequest<CheckPhoneVerificationResponse>('/auth/check_phone_verification', 'POST', {
      phone_number: phoneNumber,
      code: code
    });
  },

  // Получение списка объемов работ
  getJobSizes: async (): Promise<JobSizeResponse> => {
    return apiRequest<JobSizeResponse>('/appointment/get_list_job_size');
  },

  // Получение доступности подрядчиков
  getContractorAvailability: async (request: ContractorAvailabilityRequest): Promise<ContractorAvailabilityResponse> => {
    return apiRequest<ContractorAvailabilityResponse>('/appointment/get_contractors_availability', 'POST', request as unknown as Record<string, string | number | boolean>);
  },

  // Добавление записи
  addAppointment: async (request: AddAppointmentRequest): Promise<AddAppointmentResponse> => {
    // Создаем объект с данными для FormData
    const requestData: Record<string, string> = {
      phone_number: request.phone_number,
      firstname: request.firstname,
      lastname: request.lastname,
      house: request.house,
      city: request.city,
      state: request.state,
      zipcode: request.zipcode,
      job_size_id: request.job_size_id,
      notes: request.notes,
      start_date: request.start_date.toString(),
      timezone_offset: request.timezone_offset.toString(),
    };

    // Добавляем dispatcher_id если он есть
    if (request.dispatcher_id) {
      requestData.dispatcher_id = request.dispatcher_id;
    }
    
    // Добавляем фото в FormData отдельно
    const formData = new FormData();
    
    // Добавляем все поля
    Object.keys(requestData).forEach(key => {
      formData.append(key, requestData[key]);
    });
    
    // Добавляем фото
    request.photos.forEach((photo, index) => {
      formData.append(`photos[${index}]`, photo);
    });

    const url = `${API_BASE_URL}/appointment/add`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Add appointment request failed:', error);
      throw error;
    }
  }
}; 