import { useMemo, useEffect, useState, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import JobCard from '../components/JobCard';
import { fetchJobs } from '../services/jobService';

const PAGE_SIZE = 6;

const FILTER_KEYS = ['category', 'location', 'type', 'exp', 'sort'];

function copyFilterParams(from, to) {
  FILTER_KEYS.forEach((k) => {
    const v = from.get(k);
    if (v) to.set(k, v);
  });
}

function mapJobToCardProps(job) {
  const company = job.company;
  const companyName =
    typeof company === 'object' && company?.name ? company.name : 'Company';

  return {
    title: job.title,
    companyName,
    location: job.location,
    salary: job.salary,
    jobType: job.jobType || job.position || '',
    experienceLevel: job.experienceLevel,
    description: job.description,
    postedAt: job.createdAt || job.postedAt,
    href: `/jobs/${job._id}`,
  };
}

const EXPERIENCE_LABELS = {
  'entry-level': 'Entry level',
  'mid-level': 'Mid level',
  senior: 'Senior',
  executive: 'Executive',
};

/** Jobs listing backed by the API with URL-driven filters. */
function Jobs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = (searchParams.get('q') || '').trim();
  const categoryFilter = (searchParams.get('category') || '').trim();
  const locationFilter = (searchParams.get('location') || '').trim();
  const typeFilter = (searchParams.get('type') || '').trim();
  const expFilter = (searchParams.get('exp') || '').trim();
  const sortKey = searchParams.get('sort') || 'recent';
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);

  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadJobs = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        page,
        limit: PAGE_SIZE,
      };
      if (q) params.search = q;
      if (categoryFilter) params.category = categoryFilter;
      if (locationFilter) params.location = locationFilter;
      if (typeFilter) params.type = typeFilter;
      if (expFilter) params.experience = expFilter;
      if (sortKey === 'salary_desc' || sortKey === 'salary_asc') params.sort = sortKey;

      const res = await fetchJobs(params);
      const payload = res.data?.data;
      setJobs(payload?.jobs || []);
      setPagination(payload?.pagination || null);
    } catch (e) {
      setError(e.response?.data?.message || 'Could not load jobs. Is the API running?');
      setJobs([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }, [page, q, categoryFilter, locationFilter, typeFilter, expFilter, sortKey]);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const { jobTypes, experienceOptions } = useMemo(() => {
    const types = [...new Set(jobs.map((j) => j.jobType).filter(Boolean))].sort();
    const exps = [...new Set(jobs.map((j) => j.experience).filter(Boolean))].sort();
    return { jobTypes: types, experienceOptions: exps };
  }, [jobs]);

  const totalPages = pagination?.totalPages ?? 1;
  const totalJobs = pagination?.totalJobs ?? jobs.length;
  const safePage = Math.min(page, Math.max(1, totalPages));

  function handleSearch(e) {
    e.preventDefault();
    const form = e.target;
    const input = form.elements.namedItem('q');
    const next = new URLSearchParams();
    const term = (input?.value || '').trim();
    if (term) next.set('q', term);
    copyFilterParams(searchParams, next);
    setSearchParams(next);
  }

  function handleApplyFilters(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    const next = new URLSearchParams();

    const term = searchParams.get('q');
    if (term) next.set('q', term);
    const cat = searchParams.get('category');
    if (cat) next.set('category', cat);

    const loc = fd.get('location')?.toString().trim();
    const type = fd.get('type')?.toString().trim();
    const exp = fd.get('exp')?.toString().trim();
    const sort = fd.get('sort')?.toString().trim() || 'recent';

    if (loc) next.set('location', loc);
    if (type) next.set('type', type);
    if (exp) next.set('exp', exp);
    if (sort && sort !== 'recent') next.set('sort', sort);

    setSearchParams(next);
  }

  function goToPage(nextPage) {
    const next = new URLSearchParams(searchParams);
    if (nextPage <= 1) next.delete('page');
    else next.set('page', String(nextPage));
    setSearchParams(next);
  }

  function clearAllFilters() {
    setSearchParams({});
  }

  const categoryLabel = searchParams.get('category') || '';

  const hasExtraFilters =
    Boolean(searchParams.get('location')) ||
    Boolean(searchParams.get('type')) ||
    Boolean(searchParams.get('exp')) ||
    (searchParams.get('sort') && searchParams.get('sort') !== 'recent');

  const filterFormKey = [
    searchParams.get('location') || '',
    searchParams.get('type') || '',
    searchParams.get('exp') || '',
    searchParams.get('sort') || 'recent',
  ].join('|');

  return (
    <div className="container py-4 py-lg-5">
      <nav aria-label="breadcrumb" className="jp-breadcrumb-wrap mb-3">
        <ol className="breadcrumb jp-breadcrumb mb-0">
          <li className="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Jobs
          </li>
        </ol>
      </nav>

      <header className="jp-page-lead mb-4">
        <p className="jp-eyebrow text-primary small fw-semibold mb-2">Discover</p>
        <h1 className="display-6 fw-bold mb-2">Browse jobs</h1>
        <p className="text-muted mb-0 lead fs-6">
          {categoryLabel
            ? `Filtered by category · ${categoryLabel}`
            : 'Find roles that match your skills and goals.'}
        </p>
      </header>

      <div className="card jp-rise p-3 p-md-4 mb-4">
        <form
          className="row g-2 g-md-3 align-items-stretch align-items-md-end jp-search-bar"
          onSubmit={handleSearch}
          role="search"
        >
          <div className="col-12 col-md-8">
            <label htmlFor="jobs-search" className="form-label small text-muted mb-1">
              Keywords
            </label>
            <input
              id="jobs-search"
              name="q"
              type="search"
              className="form-control"
              placeholder="Title, skill, or keyword"
              defaultValue={searchParams.get('q') || ''}
              key={searchParams.get('q') || ''}
            />
          </div>
          <div className="col-12 col-md-4 d-grid d-md-block">
            <button type="submit" className="btn btn-primary w-100 rounded-pill fw-semibold">
              Search
            </button>
          </div>
        </form>
      </div>

      <div className="card jp-rise mb-4 overflow-hidden">
        <div className="card-body p-4">
          <h2 className="h6 fw-bold mb-1">Filters</h2>
          <p className="small text-muted mb-3">Refine salary, location, and seniority.</p>
          <form key={filterFormKey} className="row g-3 align-items-end" onSubmit={handleApplyFilters}>
            <div className="col-12 col-md-6 col-lg-3">
              <label htmlFor="filter-location" className="form-label small text-muted mb-1">
                Location
              </label>
              <input
                id="filter-location"
                name="location"
                type="text"
                className="form-control"
                placeholder="e.g. Remote, New York"
                defaultValue={searchParams.get('location') || ''}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-2">
              <label htmlFor="filter-type" className="form-label small text-muted mb-1">
                Job type
              </label>
              <select
                id="filter-type"
                name="type"
                className="form-select"
                defaultValue={searchParams.get('type') || ''}
              >
                <option value="">All types</option>
                {jobTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-12 col-md-6 col-lg-2">
              <label htmlFor="filter-exp" className="form-label small text-muted mb-1">
                Experience
              </label>
              <select
                id="filter-exp"
                name="exp"
                className="form-select"
                defaultValue={searchParams.get('exp') || ''}
              >
                <option value="">All levels</option>
                {experienceOptions.map((exp) => (
                  <option key={exp} value={exp}>
                    {EXPERIENCE_LABELS[exp] || exp}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-12 col-md-6 col-lg-2">
              <label htmlFor="filter-sort" className="form-label small text-muted mb-1">
                Sort by
              </label>
              <select
                id="filter-sort"
                name="sort"
                className="form-select"
                defaultValue={searchParams.get('sort') || 'recent'}
              >
                <option value="recent">Newest first</option>
                <option value="salary_desc">Salary · high to low</option>
                <option value="salary_asc">Salary · low to high</option>
              </select>
            </div>
            <div className="col-12 col-lg-3 d-flex flex-wrap gap-2">
              <button type="submit" className="btn btn-primary">
                Apply filters
              </button>
              <button type="button" className="btn btn-outline-secondary" onClick={clearAllFilters}>
                Reset all
              </button>
            </div>
          </form>
        </div>
      </div>

      {(categoryLabel || hasExtraFilters || q) && (
        <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
          {categoryLabel && (
            <Link
              to={(() => {
                const next = new URLSearchParams(searchParams);
                next.delete('category');
                const s = next.toString();
                return s ? `/jobs?${s}` : '/jobs';
              })()}
              className="btn btn-sm btn-outline-secondary"
            >
              Clear category
            </Link>
          )}
          {hasExtraFilters && (
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={() => {
                const next = new URLSearchParams(searchParams);
                FILTER_KEYS.forEach((k) => next.delete(k));
                setSearchParams(next);
              }}
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {error && <div className="alert jp-alert alert-warning border-0 shadow-sm">{error}</div>}

      <p className="small text-muted mb-3">
        {loading
          ? 'Loading jobs…'
          : totalJobs === 0
            ? 'No jobs match your criteria.'
            : `Showing ${jobs.length} of ${totalJobs} job${totalJobs === 1 ? '' : 's'}`}
      </p>

      {!loading && jobs.length === 0 && (
        <p className="text-muted">Adjust keywords or filters and try again.</p>
      )}

      {!loading && jobs.length > 0 && (
        <>
          <div className="row g-4 mb-4">
            {jobs.map((job) => (
              <div key={job._id} className="col-12 col-md-4">
                <JobCard {...mapJobToCardProps(job)} />
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <nav aria-label="Job list pagination" className="d-flex justify-content-center align-items-center gap-3 mt-2">
              <button
                type="button"
                className="btn btn-outline-primary btn-sm rounded-pill px-4"
                disabled={safePage <= 1}
                onClick={() => goToPage(safePage - 1)}
              >
                Previous
              </button>
              <span className="small text-muted fw-medium">
                Page {safePage} of {totalPages}
              </span>
              <button
                type="button"
                className="btn btn-outline-primary btn-sm rounded-pill px-4"
                disabled={safePage >= totalPages}
                onClick={() => goToPage(safePage + 1)}
              >
                Next
              </button>
            </nav>
          )}
        </>
      )}
    </div>
  );
}

export default Jobs;
