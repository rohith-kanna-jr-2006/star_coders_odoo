import api from './api';
import { mockUser } from './mockData';

export const login = async (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email === 'admin@dayflow.com' && password === 'admin123') {
        resolve({
          data: {
            token: 'mock-jwt-token-admin',
            user: mockUser
          }
        });
      } else if (email === 'emp@dayflow.com' && password === 'emp123') {
        resolve({
          data: {
            token: 'mock-jwt-token-emp',
            user: { ...mockUser, id: 'EMP001', role: 'employee', email: 'emp@dayflow.com' }
          }
        });
      } else {
        reject(new Error("Invalid credentials"));
      }
    }, 500);
  });
};
