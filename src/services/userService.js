import api from './api';

export function registerUser(userData) {
  const formData = new FormData();
  formData.append('name', userData.name);
  formData.append('email', userData.email);
  formData.append('password', userData.password);
  formData.append('role', userData.role);

  if (userData.avatar instanceof File && userData.avatar.size > 0) {
    formData.append('avatar', userData.avatar);
  }

  return api.post('/users/register', formData);
}

export function loginUser(credentials) {
  return api.post('/users/login', credentials);
}

export function updateUserProfile(formData) {
  return api.post('/users/update', formData);
}

export function fetchCurrentUser() {
  return api.get('/users/me');
}
