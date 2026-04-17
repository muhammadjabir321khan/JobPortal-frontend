/**
 * Placeholder data for UI only — replace with your API integration.
 */
/** Staggered `postedAt` for UI — replace with API `createdAt` / `postedAt`. */
export const MOCK_JOBS = [
  {
    _id: '1',
    postedAt: '2026-04-08T14:30:00.000Z',
    title: 'Senior Frontend Engineer',
    company: { name: 'Northwind Labs' },
    location: 'Remote · US',
    salary: 145000,
    jobType: 'Full-time',
    experienceLevel: 5,
    experience: 'senior',
    description:
      'Ship accessible React interfaces, mentor juniors, and partner with design on our job platform. Strong TypeScript and performance mindset required.',
  },
  {
    _id: '2',
    postedAt: '2026-04-07T09:00:00.000Z',
    title: 'Product Designer',
    company: { name: 'Blue River Co.' },
    location: 'New York, NY',
    salary: 120000,
    jobType: 'Full-time',
    experienceLevel: 3,
    experience: 'mid-level',
    description:
      'Own end-to-end UX for hiring flows, from research to high-fidelity prototypes. Figma expertise and systems thinking a plus.',
  },
  {
    _id: '3',
    postedAt: '2026-04-05T16:45:00.000Z',
    title: 'Backend Engineer (Node)',
    company: { name: 'Summit Systems' },
    location: 'Austin, TX · Hybrid',
    salary: 135000,
    jobType: 'Full-time',
    experienceLevel: 4,
    experience: 'mid-level',
    description:
      'Design APIs and services for high-traffic listings, applications, and notifications. MongoDB and Express experience preferred.',
  },
  {
    _id: '4',
    postedAt: '2026-04-02T11:20:00.000Z',
    title: 'Technical Recruiter',
    company: { name: 'JobPortal Talent' },
    location: 'Remote',
    salary: 95000,
    jobType: 'Full-time',
    experienceLevel: 2,
    experience: 'entry-level',
    description:
      'Source and close engineers and designers; partner with hiring managers on pipeline and candidate experience.',
  },
  {
    _id: '5',
    postedAt: '2026-03-28T08:15:00.000Z',
    title: 'Data Analyst',
    company: { name: 'Meridian Analytics' },
    location: 'Chicago, IL',
    salary: 88000,
    jobType: 'Contract',
    experienceLevel: 2,
    experience: 'entry-level',
    description:
      'Build dashboards for recruiting metrics, funnel conversion, and marketplace health. SQL and BI tools required.',
  },
  {
    _id: '6',
    postedAt: '2026-03-15T13:00:00.000Z',
    title: 'DevOps Engineer',
    company: { name: 'Cloudline' },
    location: 'Remote · EU',
    salary: 125000,
    jobType: 'Full-time',
    experienceLevel: 5,
    experience: 'senior',
    description:
      'Kubernetes, CI/CD, and observability for our multi-region deployment. On-call rotation shared across the team.',
  },
];

export function getMockJobById(id) {
  return MOCK_JOBS.find((j) => j._id === id) || MOCK_JOBS[0];
}
