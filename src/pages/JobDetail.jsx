import { useState, useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ApplicantsList from '../components/ApplicantsList';
import { IconBookmark, IconClock } from '../components/JobMetaIcons';
import { fetchJobById } from '../services/jobService';
import { applyToJob, getJobApplicants, updateApplicationStatus } from '../services/applicationService';
import { formatPostedTime } from '../utils/formatPostedTime';

function isValidObjectId(id) {
  return typeof id === 'string' && /^[a-fA-F0-9]{24}$/.test(id);
}

function JobDetail() {
  const { id } = useParams();
  const authUser = useSelector((s) => s.auth?.data?.user);
  const isAuthenticated = useSelector((s) => s.auth.isAuthenticated);

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookmarked, setBookmarked] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [cvFile, setCvFile] = useState(null);
  const [cvInputKey, setCvInputKey] = useState(0);
  const [applyMsg, setApplyMsg] = useState('');
  const [applySubmitting, setApplySubmitting] = useState(false);
  const [applicants, setApplicants] = useState([]);
  const [applicantsLoading, setApplicantsLoading] = useState(false);

  const isRecruiterOwner = useMemo(() => {
    if (!job || authUser?.role !== 'recruiter') return false;
    const creatorId = job.created_by?._id || job.created_by;
    return creatorId && String(creatorId) === String(authUser._id);
  }, [job, authUser]);

  useEffect(() => {
    if (!isValidObjectId(id)) {
      setJob(null);
      setError('Invalid job link.');
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError('');
    fetchJobById(id)
      .then((res) => {
        if (!cancelled) setJob(res.data?.data || null);
      })
      .catch((e) => {
        if (!cancelled) {
          setJob(null);
          setError(e.response?.data?.message || 'Job could not be loaded.');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    if (!isRecruiterOwner || !id) {
      setApplicants([]);
      return;
    }
    let cancelled = false;
    setApplicantsLoading(true);
    getJobApplicants(id)
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
  }, [id, isRecruiterOwner]);

  async function handleApplicantStatus(applicationId, status) {
    try {
      await updateApplicationStatus(applicationId, status);
      const res = await getJobApplicants(id);
      setApplicants(res.data?.data || []);
    } catch {
      setApplyMsg('Could not update application status.');
    }
  }

  const company = job?.company && typeof job.company === 'object' ? job.company : null;
  const salaryLabel =
    job && typeof job?.salary === 'number'
      ? new Intl.NumberFormat(undefined, {
          style: 'currency',
          currency: 'USD',
          maximumFractionDigits: 0,
        }).format(job.salary)
      : null;

  const postedLabel = formatPostedTime(job?.createdAt || job?.postedAt);

  async function handleApply(e) {
    e.preventDefault();
    setApplyMsg('');
    if (!isAuthenticated) {
      setApplyMsg('Please sign in to apply.');
      return;
    }
    if (authUser?.role !== 'student') {
      setApplyMsg('Only job seekers can submit applications.');
      return;
    }
    if (!coverLetter.trim()) {
      setApplyMsg('Please add a short cover letter.');
      return;
    }
    if (!cvFile) {
      setApplyMsg('Please attach your CV (PDF or Word, max 5MB).');
      return;
    }
    setApplySubmitting(true);
    try {
      await applyToJob(id, { coverLetter: coverLetter.trim(), resumeFile: cvFile });
      setApplyMsg('Application sent successfully.');
      setCoverLetter('');
      setCvFile(null);
      setCvInputKey((k) => k + 1);
    } catch (err) {
      setApplyMsg(err.response?.data?.message || 'Could not submit application.');
    } finally {
      setApplySubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="container py-5">
        <p className="text-muted jp-shimmer">Loading job…</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="container py-5">
        <div className="alert jp-alert alert-danger border-0 shadow-sm">{error || 'Job not found.'}</div>
        <Link to="/jobs" className="btn btn-outline-primary rounded-pill px-4">
          Back to jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-4 py-lg-5">
      <nav aria-label="breadcrumb" className="jp-breadcrumb-wrap mb-3">
        <ol className="breadcrumb jp-breadcrumb mb-0">
          <li className="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="/jobs">Jobs</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {job?.title || 'Details'}
          </li>
        </ol>
      </nav>

      <article className="card jp-rise overflow-hidden">
        <div className="card-body p-4 p-lg-5">
          <div className="d-flex justify-content-between align-items-start gap-3 mb-2">
            <div className="min-w-0">
              <h1 className="display-6 fw-bold text-primary mb-1">{job.title}</h1>
              {postedLabel && (
                <p className="small text-muted mb-0 d-flex align-items-center gap-1">
                  <IconClock className="flex-shrink-0 opacity-75" />
                  <span>{postedLabel}</span>
                </p>
              )}
            </div>
            <button
              type="button"
              className={`btn btn-outline-primary rounded-circle p-2 flex-shrink-0 job-detail-bookmark ${bookmarked ? 'active' : ''}`}
              aria-label={bookmarked ? 'Remove saved job' : 'Save job'}
              aria-pressed={bookmarked}
              onClick={() => setBookmarked((v) => !v)}
            >
              <IconBookmark filled={bookmarked} />
            </button>
          </div>
          <p className="fw-semibold mb-3">{company?.name || 'Company'}</p>
          <ul className="list-unstyled text-muted small mb-4">
            <li className="mb-1">{job.location}</li>
            {salaryLabel && <li className="mb-1">{salaryLabel}</li>}
            {job.jobType && <li className="mb-1">{job.jobType}</li>}
            {job.experienceLevel != null && (
              <li>
                {typeof job.experienceLevel === 'number'
                  ? `${job.experienceLevel}+ years experience`
                  : job.experienceLevel}
              </li>
            )}
            {job.experience && <li className="mt-1">Level: {job.experience}</li>}
          </ul>
          <h2 className="h6 fw-semibold mb-2">Description</h2>
          <p className="text-body-secondary mb-4" style={{ whiteSpace: 'pre-wrap' }}>
            {job.description}
          </p>

          {isRecruiterOwner ? (
            <section className="jp-applicants-panel border rounded-4 p-4 mb-4">
              <h2 className="h6 fw-semibold mb-3">Applicants</h2>
              {applicantsLoading ? (
                <p className="small text-muted mb-0">Loading applicants…</p>
              ) : (
                <ApplicantsList applicants={applicants} onStatusChange={handleApplicantStatus} />
              )}
            </section>
          ) : null}

          {authUser?.role === 'student' ? (
            <form onSubmit={handleApply} className="mb-4 jp-apply-form">
              <label htmlFor="apply-resume" className="form-label fw-semibold">
                CV / résumé
              </label>
              <input
                key={cvInputKey}
                id="apply-resume"
                name="resume"
                type="file"
                className="form-control mb-3 rounded-4"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={(e) => setCvFile(e.target.files?.[0] ?? null)}
              />
              <p className="small text-muted mb-3">PDF or Word · up to 5MB</p>
              <label htmlFor="cover-letter" className="form-label fw-semibold">
                Cover letter
              </label>
              <textarea
                id="cover-letter"
                className="form-control mb-3 rounded-4"
                rows={4}
                placeholder="Briefly explain why you are a good fit…"
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
              />
              {applyMsg ? (
                <p
                  className={`small ${applyMsg.includes('success') ? 'text-success' : 'text-danger'} mb-2`}
                  role="status"
                >
                  {applyMsg}
                </p>
              ) : null}
              <div className="d-flex flex-wrap gap-2">
                <button
                  type="submit"
                  className="btn btn-primary rounded-pill px-4 fw-semibold"
                  disabled={applySubmitting}
                >
                  {applySubmitting ? 'Submitting…' : 'Apply'}
                </button>
                <Link to="/jobs" className="btn btn-outline-secondary rounded-pill px-4">
                  Back to jobs
                </Link>
              </div>
            </form>
          ) : (
            <div className="d-flex flex-wrap gap-2 mb-2">
              {!isAuthenticated ? (
                <Link to="/login" className="btn btn-primary rounded-pill px-4 fw-semibold">
                  Sign in to apply
                </Link>
              ) : authUser?.role === 'recruiter' && !isRecruiterOwner ? (
                <p className="text-muted small mb-0">
                  Recruiters browse openings from the jobs list; manage your postings in the dashboard.
                </p>
              ) : null}
              <Link to="/jobs" className="btn btn-outline-secondary rounded-pill px-4">
                Back to jobs
              </Link>
            </div>
          )}
        </div>
      </article>
    </div>
  );
}

export default JobDetail;
