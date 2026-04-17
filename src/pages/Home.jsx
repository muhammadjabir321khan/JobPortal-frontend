import { useEffect, useState } from 'react';
import HeroSection from '../components/HeroSection';
import CategoryCarousel from '../components/CategoryCarousel';
import JobCard from '../components/JobCard';
import { fetchJobs } from '../services/jobService';

function Home() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchJobs({ page: 1, limit: 6 })
      .then((res) => {
        const list = res.data?.data?.jobs || [];
        if (!cancelled) setJobs(list);
      })
      .catch(() => {
        if (!cancelled) setJobs([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="container py-3">
      <HeroSection />
      <CategoryCarousel />
      <section className="page-content py-4" aria-labelledby="featured-jobs-heading">
        <h2 id="featured-jobs-heading" className="h4 fw-semibold mb-3">
          Featured jobs
        </h2>
        {loading ? (
          <p className="text-muted small">Loading featured roles…</p>
        ) : jobs.length === 0 ? (
          <p className="text-muted small">No jobs yet. Check back soon.</p>
        ) : (
          <div className="row g-4">
            {jobs.map((job) => (
              <div key={job._id} className="col-12 col-md-4">
                <JobCard
                  title={job.title}
                  companyName={job.company?.name || 'Company'}
                  location={job.location}
                  salary={job.salary}
                  jobType={job.jobType}
                  experienceLevel={job.experienceLevel}
                  description={job.description}
                  postedAt={job.createdAt || job.postedAt}
                  href={`/jobs/${job._id}`}
                />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;
