/**
 * Mock applicants per job — UI only. Replace with GET /api/applications?job=:id (or similar).
 */
export const MOCK_APPLICANTS_BY_JOB = {
  '1': [
    {
      id: 'app-1',
      name: 'Jordan Lee',
      email: 'jordan.lee@email.com',
      status: 'pending',
      appliedAt: '2026-04-08T10:15:00.000Z',
    },
    {
      id: 'app-2',
      name: 'Samira Khan',
      email: 'samira.k@email.com',
      status: 'pending',
      appliedAt: '2026-04-07T14:40:00.000Z',
    },
    {
      id: 'app-3',
      name: 'Marcus Chen',
      email: 'mchen.dev@email.com',
      status: 'accepted',
      appliedAt: '2026-04-06T09:00:00.000Z',
    },
  ],
  '2': [
    {
      id: 'app-4',
      name: 'Alex Rivera',
      email: 'alex.r@email.com',
      status: 'pending',
      appliedAt: '2026-04-08T16:20:00.000Z',
    },
    {
      id: 'app-5',
      name: 'Priya Nair',
      email: 'priya.nair@email.com',
      status: 'rejected',
      appliedAt: '2026-04-05T11:30:00.000Z',
    },
  ],
  '3': [
    {
      id: 'app-6',
      name: 'Chris Okafor',
      email: 'c.okafor@email.com',
      status: 'pending',
      appliedAt: '2026-04-07T08:45:00.000Z',
    },
  ],
};

export function getMockApplicantsForJob(jobId) {
  return MOCK_APPLICANTS_BY_JOB[jobId] || [];
}
