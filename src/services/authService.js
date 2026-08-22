import api from './api';

export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  // The backend wraps the payload in a 'data' object inside the JSON response.
  // Axios already wraps the JSON response in 'data', so we return response.data.data
  return {
    data: response.data.data
  };
};
