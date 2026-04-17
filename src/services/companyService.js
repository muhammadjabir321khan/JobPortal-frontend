import api from './api';

export function getMyCompanies() {
  return api.get('/company/register');
}

export function registerCompany(companyName) {
  return api.post('/company/register', { Cname: companyName });
}
