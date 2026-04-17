import { MOCK_JOBS } from './mockJobs';

function jobById(id) {
  return MOCK_JOBS.find((j) => j._id === id);
}

/**
 * Jobs the user has applied to — UI only. Replace with your applications API.
 */
export const MOCK_APPLIED_JOBS = [
  {
    applicationId: 'app-u1',
    jobId: '1',
    status: 'pending',
    appliedAt: '2026-04-08T10:00:00.000Z',
  },
  {
    applicationId: 'app-u2',
    jobId: '2',
    status: 'pending',
    appliedAt: '2026-04-07T09:15:00.000Z',
  },
  {
    applicationId: 'app-u3',
    jobId: '3',
    status: 'accepted',
    appliedAt: '2026-04-05T14:30:00.000Z',
  },
  {
    applicationId: 'app-u4',
    jobId: '5',
    status: 'rejected',
    appliedAt: '2026-03-30T11:00:00.000Z',
  },
]
  .map((row) => ({
    ...row,
    job: jobById(row.jobId),
  }))
  .filter((row) => row.job);
