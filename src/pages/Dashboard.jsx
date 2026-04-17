import { useEffect, useState, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setAuthUser } from '../stores/authSlice';
import { fetchCurrentUser } from '../services/userService';
import AppliedJobsList from '../components/AppliedJobsList';
import ApplicantsList from '../components/ApplicantsList';
import { getMyApplications, getJobApplicants, updateApplicationStatus } from '../services/applicationService';
import { fetchMyJobs, createJob } from '../services/jobService';
import { getMyCompanies, registerCompany } from '../services/companyService';

function mapApplicationForList(row) {
  return {
    applicationId: row._id,
    status: row.status,
    appliedAt: row.createdAt,
    resumeUrl: row.resumeUrl || '',
    job: row.job || { _id: '', title: 'Job unavailable', company: null, location: '' },
  };
}

const RECRUITER_ORG_ALL = 'all';

function jobCompanyId(job) {
  const c = job?.company;
  if (!c) return '';
  if (typeof c === 'object' && c._id != null) return String(c._id);
  return String(c);
}

function StudentDashboard() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getMyApplications()
      .then((res) => {
        const rows = res.data?.data || [];
        if (!cancelled) setItems(rows.map(mapApplicationForList));
      })
      .catch(() => {
        if (!cancelled) setItems([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="row g-4">
      <div className="col-12 col-lg-4">
        <div className="card jp-rise h-100">
          <div className="card-body p-4">
            <p className="jp-eyebrow text-primary small fw-semibold mb-1">Overview</p>
            <h2 className="h5 fw-bold mb-3">Your activity</h2>
            <p className="text-muted small mb-3">
              Track applications and keep your profile up to date so recruiters can find you.
            </p>
            <Link to="/profile" className="btn btn-outline-primary btn-sm me-2">
              Edit profile
            </Link>
            <Link to="/jobs" className="btn btn-primary btn-sm">
              Browse jobs
            </Link>
          </div>
        </div>
      </div>
      <div className="col-12 col-lg-8">
        <section className="card jp-rise h-100 overflow-hidden">
          <div className="card-header jp-card-header py-3 d-flex justify-content-between align-items-center">
            <h2 className="h5 fw-semibold mb-0">Applications</h2>
            <span className="badge jp-badge">{items.length}</span>
          </div>
          <div className="card-body p-0">
            {loading ? (
              <p className="text-muted small p-4 mb-0">Loading…</p>
            ) : (
              <AppliedJobsList items={items} />
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function RecruiterDashboard() {
  const dispatch = useDispatch();
  const [companies, setCompanies] = useState([]);
  const [companyLoading, setCompanyLoading] = useState(true);
  const [companyName, setCompanyName] = useState('');
  const [companyMsg, setCompanyMsg] = useState('');

  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(true);

  const [post, setPost] = useState({
    title: '',
    description: '',
    companyId: '',
    location: '',
    salary: '',
    jobType: 'Full-time',
    experience: 'mid-level',
    experienceLevel: '2',
  });
  const [postMsg, setPostMsg] = useState('');
  const [postSubmitting, setPostSubmitting] = useState(false);

  const [selectedJobId, setSelectedJobId] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [applicantsLoading, setApplicantsLoading] = useState(false);

  const [selectedOrgFilter, setSelectedOrgFilter] = useState(RECRUITER_ORG_ALL);

  const loadCompanies = useCallback(async () => {
    setCompanyLoading(true);
    try {
      const res = await getMyCompanies();
      const list = res.data?.data || [];
      const arr = Array.isArray(list) ? list : [];
      setCompanies(arr);
      setPost((p) => {
        if (!p.companyId && arr.length) return { ...p, companyId: arr[0]._id };
        return p;
      });
    } catch (e) {
      if (e.response?.status === 404) {
        setCompanies([]);
      } else {
        setCompanyMsg(e.response?.data?.message || 'Could not load company.');
      }
    } finally {
      setCompanyLoading(false);
    }
  }, []);

  const loadJobs = useCallback(async () => {
    setJobsLoading(true);
    try {
      const res = await fetchMyJobs();
      setJobs(res.data?.data || []);
    } catch {
      setJobs([]);
    } finally {
      setJobsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCompanies();
  }, [loadCompanies]);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  useEffect(() => {
    if (!selectedJobId) {
      setApplicants([]);
      return;
    }
    let cancelled = false;
    setApplicantsLoading(true);
    getJobApplicants(selectedJobId)
      .then((res) => {
        if (!cancelled) setApplicants(res.data?.data || []);
      })
      .catch(() => {
        if (!cancelled) setApplicants([]);
      })
      .finally(() => {
        if (!cancelled) setApplicantsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedJobId]);

  useEffect(() => {
    if (selectedOrgFilter === RECRUITER_ORG_ALL) return;
    if (!companies.some((c) => String(c._id) === String(selectedOrgFilter))) {
      setSelectedOrgFilter(RECRUITER_ORG_ALL);
    }
  }, [companies, selectedOrgFilter]);

  useEffect(() => {
    if (selectedOrgFilter === RECRUITER_ORG_ALL) return;
    setPost((p) => ({ ...p, companyId: selectedOrgFilter }));
  }, [selectedOrgFilter]);

  useEffect(() => {
    if (!selectedJobId) return;
    const visible =
      selectedOrgFilter === RECRUITER_ORG_ALL
        ? jobs
        : jobs.filter((j) => jobCompanyId(j) === String(selectedOrgFilter));
    if (!visible.some((j) => j._id === selectedJobId)) {
      setSelectedJobId(null);
    }
  }, [jobs, selectedOrgFilter, selectedJobId]);

  async function handleRegisterCompany(e) {
    e.preventDefault();
    setCompanyMsg('');
    if (!companyName.trim()) {
      setCompanyMsg('Enter a company name.');
      return;
    }
    try {
      await registerCompany(companyName.trim());
      setCompanyName('');
      const me = await fetchCurrentUser();
      const u = me.data?.data?.user;
      if (u) dispatch(setAuthUser(u));
      await loadCompanies();
      setCompanyMsg('Company registered. You can post jobs.');
    } catch (err) {
      setCompanyMsg(err.response?.data?.message || 'Could not register company.');
    }
  }

  async function handleCreateJob(e) {
    e.preventDefault();
    setPostMsg('');
    if (!post.companyId) {
      setPostMsg('Register a company first.');
      return;
    }
    setPostSubmitting(true);
    try {
      const salaryNum = Number(post.salary);
      if (Number.isNaN(salaryNum)) {
        setPostMsg('Salary must be a number.');
        setPostSubmitting(false);
        return;
      }
      const experienceLevel = Number(post.experienceLevel);
      if (Number.isNaN(experienceLevel)) {
        setPostMsg('Experience (years) must be a number.');
        setPostSubmitting(false);
        return;
      }
      await createJob({
        title: post.title.trim(),
        description: post.description.trim(),
        company: post.companyId,
        location: post.location.trim(),
        salary: salaryNum,
        jobType: post.jobType.trim(),
        experience: post.experience,
        experienceLevel,
      });
      setPostMsg('Job published successfully.');
      setPost((p) => ({
        ...p,
        title: '',
        description: '',
        location: '',
        salary: '',
      }));
      await loadJobs();
    } catch (err) {
      setPostMsg(err.response?.data?.message || 'Could not create job.');
    } finally {
      setPostSubmitting(false);
    }
  }

  async function handleApplicantStatus(applicationId, status) {
    if (!selectedJobId) return;
    try {
      await updateApplicationStatus(applicationId, status);
      const res = await getJobApplicants(selectedJobId);
      setApplicants(res.data?.data || []);
      await loadJobs();
    } catch {
      setPostMsg('Could not update application.');
    }
  }

  const visibleJobs =
    selectedOrgFilter === RECRUITER_ORG_ALL
      ? jobs
      : jobs.filter((j) => jobCompanyId(j) === String(selectedOrgFilter));

  const totalAppsAll = jobs.reduce(
    (acc, j) => acc + (Array.isArray(j.application) ? j.application.length : 0),
    0
  );
  const totalAppsVisible = visibleJobs.reduce(
    (acc, j) => acc + (Array.isArray(j.application) ? j.application.length : 0),
    0
  );

  const jobCountForCompany = (companyId) =>
    jobs.filter((j) => jobCompanyId(j) === String(companyId)).length;

  const sidebarRegisterForm = (
    <form className="jp-dash-sidebar__add-form" onSubmit={handleRegisterCompany}>
      <label className="form-label small text-muted mb-1" htmlFor="dash-cname">
        {companies.length ? 'Add another organization' : 'Register your organization'}
      </label>
      <input
        id="dash-cname"
        className="form-control form-control-sm mb-2"
        value={companyName}
        onChange={(e) => setCompanyName(e.target.value)}
        placeholder="Company name"
      />
      <button type="submit" className="btn btn-primary btn-sm w-100">
        Save
      </button>
      {companyMsg ? (
        <p
          className={`small mb-0 mt-2 ${companyMsg.includes('registered') || companyMsg.includes('success') ? 'text-success' : 'text-danger'}`}
        >
          {companyMsg}
        </p>
      ) : null}
    </form>
  );

  return (
    <div className="row g-4 jp-recruiter-dash align-items-start">
      <aside className="col-12 col-lg-3">
        <div className="jp-dash-sidebar jp-rise p-3 p-lg-4 sticky-lg-top">
          <p className="jp-eyebrow text-primary small fw-semibold mb-2">Organizations</p>
          <p className="text-muted small mb-3">
            Switch context when you recruit for more than one company. Stats and listings follow your
            selection.
          </p>
          {companyLoading ? (
            <p className="text-muted small jp-shimmer mb-0">Loading…</p>
          ) : companies.length ? (
            <ul className="list-unstyled jp-dash-sidebar__org-list mb-0">
              <li className="mb-1">
                <button
                  type="button"
                  className={`jp-dash-sidebar__org ${selectedOrgFilter === RECRUITER_ORG_ALL ? 'is-active' : ''}`}
                  onClick={() => setSelectedOrgFilter(RECRUITER_ORG_ALL)}
                >
                  <span className="jp-dash-sidebar__org-name">All organizations</span>
                  <span className="jp-dash-sidebar__org-meta">{jobs.length} jobs</span>
                </button>
              </li>
              {companies.map((c) => (
                <li key={c._id} className="mb-1">
                  <button
                    type="button"
                    className={`jp-dash-sidebar__org ${String(selectedOrgFilter) === String(c._id) ? 'is-active' : ''}`}
                    onClick={() => setSelectedOrgFilter(String(c._id))}
                  >
                    <span className="jp-dash-sidebar__org-name">{c.name}</span>
                    <span className="jp-dash-sidebar__org-meta">{jobCountForCompany(c._id)} jobs</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted small mb-3">No organizations yet. Add one below to post jobs.</p>
          )}
          <div className="jp-dash-sidebar__divider my-3" />
          <div id="add-company">{sidebarRegisterForm}</div>
        </div>
      </aside>

      <div className="col-12 col-lg-9 d-flex flex-column gap-4">
      <div className="row g-3">
        <div className="col-12 col-md-4">
          <div className="jp-stat jp-stat--indigo h-100">
            <p className="jp-stat__label mb-1">Open roles</p>
            <p className="jp-stat__value mb-0">{visibleJobs.length}</p>
            {selectedOrgFilter !== RECRUITER_ORG_ALL ? (
              <p className="jp-stat__hint mb-0 mt-1 small">Filtered · {jobs.length} total</p>
            ) : null}
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="jp-stat jp-stat--cyan h-100">
            <p className="jp-stat__label mb-1">Applications</p>
            <p className="jp-stat__value mb-0">{totalAppsVisible}</p>
            {selectedOrgFilter !== RECRUITER_ORG_ALL ? (
              <p className="jp-stat__hint mb-0 mt-1 small">{totalAppsAll} total</p>
            ) : null}
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="jp-stat jp-stat--violet h-100">
            <p className="jp-stat__label mb-1">Companies</p>
            <p className="jp-stat__value mb-0">{companies.length}</p>
          </div>
        </div>
      </div>

      <section className="card jp-rise jp-post-job-card overflow-hidden" id="post-job">
        <div className="jp-post-job-card__banner px-4 py-3">
          <h2 className="h5 fw-bold text-white mb-1">Create a listing</h2>
          <p className="small text-white text-opacity-75 mb-0">
            Publish a role to JobPortal — candidates apply with a cover letter and CV.
          </p>
        </div>
        <div className="card-body p-4">
          {!companies.length ? (
            <div className="alert jp-alert alert-info border-0 mb-0" role="status">
              Register your company in the section above to unlock the job form.
            </div>
          ) : (
            <form className="row g-3 g-md-4" onSubmit={handleCreateJob}>
              <div className="col-12 col-md-6">
                <label className="form-label small">Company</label>
                <select
                  className="form-select"
                  value={post.companyId}
                  onChange={(e) => setPost((p) => ({ ...p, companyId: e.target.value }))}
                >
                  {companies.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label small">Job title</label>
                <input
                  className="form-control"
                  value={post.title}
                  onChange={(e) => setPost((p) => ({ ...p, title: e.target.value }))}
                  required
                />
              </div>
              <div className="col-12">
                <label className="form-label small">Description</label>
                <textarea
                  className="form-control"
                  rows={4}
                  value={post.description}
                  onChange={(e) => setPost((p) => ({ ...p, description: e.target.value }))}
                  required
                />
              </div>
              <div className="col-12 col-md-4">
                <label className="form-label small">Location</label>
                <input
                  className="form-control"
                  value={post.location}
                  onChange={(e) => setPost((p) => ({ ...p, location: e.target.value }))}
                  required
                />
              </div>
              <div className="col-12 col-md-4">
                <label className="form-label small">Salary (USD)</label>
                <input
                  className="form-control"
                  type="number"
                  min={0}
                  value={post.salary}
                  onChange={(e) => setPost((p) => ({ ...p, salary: e.target.value }))}
                  required
                />
              </div>
              <div className="col-12 col-md-4">
                <label className="form-label small">Job type</label>
                <input
                  className="form-control"
                  value={post.jobType}
                  onChange={(e) => setPost((p) => ({ ...p, jobType: e.target.value }))}
                />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label small">Seniority band</label>
                <select
                  className="form-select"
                  value={post.experience}
                  onChange={(e) => setPost((p) => ({ ...p, experience: e.target.value }))}
                >
                  <option value="entry-level">Entry level</option>
                  <option value="mid-level">Mid level</option>
                  <option value="senior">Senior</option>
                  <option value="executive">Executive</option>
                </select>
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label small">Minimum years of experience (number)</label>
                <input
                  className="form-control"
                  type="number"
                  min={0}
                  value={post.experienceLevel}
                  onChange={(e) => setPost((p) => ({ ...p, experienceLevel: e.target.value }))}
                  required
                />
              </div>
              <div className="col-12 d-flex flex-wrap gap-2 align-items-center pt-2 border-top border-light-subtle">
                <button
                  type="submit"
                  className="btn btn-primary rounded-pill px-4 fw-semibold"
                  disabled={postSubmitting}
                >
                  {postSubmitting ? 'Publishing…' : 'Publish job'}
                </button>
                {postMsg ? (
                  <span className={`small ${postMsg.includes('success') ? 'text-success' : 'text-danger'}`}>
                    {postMsg}
                  </span>
                ) : null}
              </div>
            </form>
          )}
        </div>
      </section>

      <section className="card jp-rise overflow-hidden">
        <div className="card-header jp-card-header d-flex flex-wrap justify-content-between align-items-center gap-2">
          <span className="fw-semibold">Your postings</span>
          <Link to="/jobs" className="btn btn-sm btn-outline-primary rounded-pill px-3">
            View public listings
          </Link>
        </div>
        <div className="card-body p-0">
          {jobsLoading ? (
            <p className="text-muted small p-3 mb-0">Loading jobs…</p>
          ) : jobs.length === 0 ? (
            <p className="text-muted small p-3 mb-0">No jobs yet. Publish your first role above.</p>
          ) : visibleJobs.length === 0 ? (
            <p className="text-muted small p-3 mb-0">
              No jobs for this organization in the current view. Choose &ldquo;All organizations&rdquo; or post
              a role for this company.
            </p>
          ) : (
            <div className="table-responsive">
              <table className="table jp-table table-hover mb-0 align-middle">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Location</th>
                    <th className="text-end">Applications</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {visibleJobs.map((j) => {
                    const count = Array.isArray(j.application) ? j.application.length : 0;
                    const active = selectedJobId === j._id;
                    return (
                      <tr key={j._id} className={active ? 'jp-row-active' : ''}>
                        <td className="fw-medium">{j.title}</td>
                        <td className="text-muted small">{j.location}</td>
                        <td className="text-end">{count}</td>
                        <td className="text-end">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary rounded-pill px-3"
                            onClick={() => setSelectedJobId(active ? null : j._id)}
                          >
                            {active ? 'Hide applicants' : 'Applicants'}
                          </button>
                          <Link to={`/jobs/${j._id}`} className="btn btn-sm btn-link fw-semibold">
                            Open
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
        {selectedJobId ? (
          <div className="jp-applicants-panel border-top p-4">
            <h3 className="h6 fw-semibold mb-3">Applicants for selected role</h3>
            {applicantsLoading ? (
              <p className="small text-muted mb-0">Loading…</p>
            ) : (
              <ApplicantsList applicants={applicants} onStatusChange={handleApplicantStatus} />
            )}
          </div>
        ) : null}
      </section>
      </div>
    </div>
  );
}

function Dashboard() {
  const location = useLocation();
  const user = useSelector((s) => s.auth?.data?.user);
  const role = user?.role;

  useEffect(() => {
    if (role !== 'recruiter') return;
    if (location.hash !== '#post-job' && location.hash !== '#add-company') return;
    const timer = window.setTimeout(() => {
      const id = location.hash === '#add-company' ? 'add-company' : 'post-job';
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (id === 'post-job') {
          el.classList.add('jp-post-job-flash');
          window.setTimeout(() => el.classList.remove('jp-post-job-flash'), 2000);
        }
      }
    }, 150);
    return () => window.clearTimeout(timer);
  }, [location.hash, location.pathname, role]);

  return (
    <div className="container py-4 py-lg-5">
      <header className="jp-page-header mb-4 mb-lg-5">
        <p className="jp-eyebrow text-primary small fw-semibold mb-2">Dashboard</p>
        <h1 className="display-6 fw-bold mb-2">
          Welcome back{user?.name ? `, ${user.name}` : ''}
        </h1>
        <p className="text-muted mb-0 lead fs-6">
          {role === 'recruiter'
            ? 'Manage your company profile, postings, and incoming applications.'
            : 'Track applications and discover your next role.'}
        </p>
      </header>

      {role === 'recruiter' ? <RecruiterDashboard /> : <StudentDashboard />}
    </div>
  );
}

export default Dashboard;
