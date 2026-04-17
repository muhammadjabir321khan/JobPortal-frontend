import api from './api';

export function fetchJobs(params) {
  return api.get('/jobs', { params });
}

export function fetchJobById(id) {
  return api.get(`/jobs/${id}`);
}

export function fetchMyJobs() {
  return api.get('/jobs/my-jobs');
}

export function createJob(payload) {
  return api.post('/jobs/job', payload);
}

export function updateJob(id, payload) {
  return api.put(`/jobs/update/${id}`, payload);
}

export function deleteJob(id) {
  return api.delete(`/jobs/delete/${id}`);
}
