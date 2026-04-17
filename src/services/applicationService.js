import api from './api';

/**
 * @param {string} jobId
 * @param {{ coverLetter: string; resumeFile: File }} payload
 */
export function applyToJob(jobId, { coverLetter, resumeFile }) {
  const formData = new FormData();
  formData.append('coverLetter', coverLetter);
  if (resumeFile) {
    formData.append('resume', resumeFile);
  }
  return api.post(`/applications/apply/${jobId}`, formData);
}

export function getMyApplications() {
  return api.get('/applications/applied-jobs');
}

export function getJobApplicants(jobId) {
  return api.get(`/applications/applicants/${jobId}`);
}

export function updateApplicationStatus(applicationId, status) {
  return api.put(`/applications/applications/${applicationId}`, { status });
}
